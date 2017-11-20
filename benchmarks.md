We do some benchmarking calling 1, 10 and 100 times iteratively the api `FastText.predict` as a web service:

**one call**

```
$ ab -n 1 "http://localhost:3030/?text=bader"
This is ApacheBench, Version 2.3 <$Revision: 1757674 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient).....done


Server Software:        
Server Hostname:        localhost
Server Port:            3030

Document Path:          /?text=bader
Document Length:        164 bytes

Concurrency Level:      1
Time taken for tests:   0.001 seconds
Complete requests:      1
Failed requests:        0
Total transferred:      271 bytes
HTML transferred:       164 bytes
Requests per second:    712.76 [#/sec] (mean)
Time per request:       1.403 [ms] (mean)
Time per request:       1.403 [ms] (mean, across all concurrent requests)
Transfer rate:          188.63 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.0      0       0
Processing:     1    1   0.0      1       1
Waiting:        1    1   0.0      1       1
Total:          1    1   0.0      1       1
```

**10 calls**

```
[loretoparisi@:mbploreto task]$ ab -n 10 "http://localhost:3030/?text=bader"
This is ApacheBench, Version 2.3 <$Revision: 1757674 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient).....done


Server Software:        
Server Hostname:        localhost
Server Port:            3030

Document Path:          /?text=bader
Document Length:        164 bytes

Concurrency Level:      1
Time taken for tests:   0.011 seconds
Complete requests:      10
Failed requests:        4
   (Connect: 0, Receive: 0, Length: 4, Exceptions: 0)
Total transferred:      2726 bytes
HTML transferred:       1656 bytes
Requests per second:    941.00 [#/sec] (mean)
Time per request:       1.063 [ms] (mean)
Time per request:       1.063 [ms] (mean, across all concurrent requests)
Transfer rate:          250.50 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.0      0       0
Processing:     0    1   0.5      1       2
Waiting:        0    1   0.3      1       1
Total:          1    1   0.5      1       2

Percentage of the requests served within a certain time (ms)
  50%      1
  66%      1
  75%      1
  80%      1
  90%      2
  95%      2
  98%      2
  99%      2
 100%      2 (longest request)
```

**100 calls**

```
[loretoparisi@:mbploreto task]$ ab -n 100 "http://localhost:3030/?text=bader"
This is ApacheBench, Version 2.3 <$Revision: 1757674 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient).....done


Server Software:        
Server Hostname:        localhost
Server Port:            3030

Document Path:          /?text=bader
Document Length:        168 bytes

Concurrency Level:      1
Time taken for tests:   0.095 seconds
Complete requests:      100
Failed requests:        73
   (Connect: 0, Receive: 0, Length: 73, Exceptions: 0)
Total transferred:      27208 bytes
HTML transferred:       16508 bytes
Requests per second:    1054.37 [#/sec] (mean)
Time per request:       0.948 [ms] (mean)
Time per request:       0.948 [ms] (mean, across all concurrent requests)
Transfer rate:          280.15 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.0      0       0
Processing:     0    1   1.2      0       9
Waiting:        0    1   1.2      0       9
Total:          0    1   1.2      1       9

Percentage of the requests served within a certain time (ms)
  50%      1
  66%      1
  75%      1
  80%      1
  90%      2
  95%      3
  98%      7
  99%      9
 100%      9 (longest request)
```
