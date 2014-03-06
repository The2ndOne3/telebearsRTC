# TODO
## Leo
* Figure out email/text confirmation -- LOW PRIORITY
* Add email/text confirmation endpoints -- LOW PRIORITY
* Figure out alerts
* Figure out phone number validation -- LOW PRIORITY
* Add subscribing endpoint -- DONE
* Add update user info endpoint -- DONE
* Figure out polling -- DONE
* Test key locking of polling updates

## Larry
* Fix login view -- DONE
* Fix layout top bar -- DONE
* Hook up stuff -- DONE

# Services
## Main
NodeJS
MongoDB (MongoLab)
Redis (RedisToGo)
SendGrid (SendGrid)
Tropo (Tropo)

## Polling
NodeJS
<!-- Redis (RedisToGo) -->

# Future features
* Multiple email/text support on front-end
* Rebuild polling server to use Intercom (or roll own IPC)
* Add failure resistance to polling server (store the list of CCNs to pull out of memory, maybe in Redis?)
* Build public API
