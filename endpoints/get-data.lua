--#ENDPOINT get /data
response.message = Timeseries.query({q='select * from "data" group by sn order by desc limit 500'})