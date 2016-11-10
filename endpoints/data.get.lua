--#ENDPOINT get /data
response.message = Timeseries.query({q='select * from "data" WHERE timestamp > now() - 1d group by sn order by desc limit 1000'})