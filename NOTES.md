# TODO
## Leo
* Figure out alerts
* Test key locking of polling updates

* Figure out email/text confirmation -- LOW PRIORITY
* Add email/text confirmation endpoints -- LOW PRIORITY
* Figure out phone number validation -- LOW PRIORITY

## Larry
* Fix login view -- DONE
* Fix layout top bar -- DONE
* Hook up stuff -- DONE

# Tests (which we should automate)
* Accounts
  * subscribe (works)
  * unsubscribe (works)
  * add info ??
  * update info ??
  * remove info (currently unsupported)
* Polling
  * listen (works)
  * key locking (works)
* Alerts
  * 

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
