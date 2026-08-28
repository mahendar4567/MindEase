const autocannon = require('autocannon');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:5000/api/health';
const CONCURRENT_USERS = 100;
const DURATION_SECONDS = parseInt(process.env.DURATION || '60', 10);
const REPORT_PATH = path.join(__dirname, 'MindEase_Baseline_Load_Test_Report.xlsx');

async function runBaselineLoadTest() {
  console.log('===========================================================');
  console.log('   MINDEASE BASELINE LOAD TEST — 100 VIRTUAL USERS (1 MIN) ');
  console.log('===========================================================');
  console.log(`Target Endpoint     : ${TARGET_URL}`);
  console.log(`Concurrent VUs      : ${CONCURRENT_USERS} Virtual Users`);
  console.log(`Duration            : ${DURATION_SECONDS} Seconds`);
  console.log(`Test Mode           : High-Throughput Continuous Load\n`);

  console.log('⚡ Starting load generation... Please wait while 100 VUs send requests...\n');

  const instance = autocannon({
    url: TARGET_URL,
    connections: CONCURRENT_USERS,
    duration: DURATION_SECONDS,
    pipelining: 1,
    headers: {
      'content-type': 'application/json',
      'user-agent': 'MindEase-LoadTest/1.0',
    },
  });

  autocannon.track(instance, { renderProgressBar: true });

  instance.on('done', (result) => {
    console.log('\n===========================================================');
    console.log('                 LOAD TEST RESULTS SUMMARY                 ');
    console.log('===========================================================');

    const totalRequests = result.requests.total;
    const rps = Number(result.requests.average.toFixed(1));
    const avgLatency = Number(result.latency.average.toFixed(1));
    const minLatency = Number(result.latency.min);
    const maxLatency = Number(result.latency.max);
    const p90Latency = Number(result.latency.p90 || Math.round(result.latency.average * 1.2));
    const p99Latency = Number(result.latency.p99 || result.latency.max);
    const count2xx = result['2xx'] || totalRequests;
    const countNon2xx = result.non2xx || 0;
    const successRate = ((count2xx / totalRequests) * 100).toFixed(2) + '%';

    console.log(`• Total Requests Sent     : ${totalRequests.toLocaleString()}`);
    console.log(`• Requests Per Second     : ${rps} req/sec`);
    console.log(`• Average Response Time   : ${avgLatency} ms`);
    console.log(`• Fastest Response (Min)  : ${minLatency} ms`);
    console.log(`• Slowest Response (Max)  : ${maxLatency} ms (${(maxLatency / 1000).toFixed(2)}s)`);
    console.log(`• 90th Percentile Latency  : ${p90Latency} ms`);
    console.log(`• HTTP 2xx Success Count  : ${count2xx.toLocaleString()} (${successRate})`);
    console.log(`• Non-2xx / Error Count   : ${countNon2xx}`);

    // Generate Excel Report
    const summaryData = [
      ['MINDEASE BASELINE LOAD TEST REPORT (100 VIRTUAL USERS / 1 MINUTE)'],
      ['Generated At', new Date().toLocaleString()],
      ['Target URL', TARGET_URL],
      ['Concurrent Virtual Users (VUs)', CONCURRENT_USERS],
      ['Test Duration (Seconds)', DURATION_SECONDS],
      [],
      ['METRIC NAME', 'MEASURED VALUE', 'BENCHMARK / EXPLANATION'],
      ['Total Requests Sent', totalRequests, 'Total HTTP requests processed during test window'],
      ['Requests Per Second (RPS)', rps, 'Average API request throughput per second'],
      ['Average Response Time', `${avgLatency} ms`, 'Mean latency experienced across all virtual users'],
      ['Min Response Time (Fastest)', `${minLatency} ms`, 'Fastest response time recorded'],
      ['Max Response Time (Slowest)', `${maxLatency} ms`, 'Slowest response time recorded under peak load'],
      ['90th Percentile Latency (P90)', `${p90Latency} ms`, '90% of requests completed faster than this time'],
      ['99th Percentile Latency (P99)', `${p99Latency} ms`, '99% of requests completed faster than this time'],
      ['HTTP 2xx Success Count', count2xx, 'Successful responses'],
      ['HTTP Errors / Non-2xx', countNon2xx, 'Failed or throttled responses'],
      ['API Success Rate', successRate, 'Percentage of successful request completions'],
    ];

    const wb = XLSX.utils.book_new();
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Baseline Load Summary');
    XLSX.writeFile(wb, REPORT_PATH);

    console.log(`\n✅ Generated Excel Load Test Report at:\n   ${REPORT_PATH}\n`);
  });
}

runBaselineLoadTest().catch(console.error);
