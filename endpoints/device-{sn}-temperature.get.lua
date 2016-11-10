--#ENDPOINT get /device/{sn}/temperature
--#ENDPOINT get /data
response.message = Timeseries.query({q='select * from "data" WHERE timestamp > now() - 1d and desired_temperature <> 0 order by desc limit 1'})