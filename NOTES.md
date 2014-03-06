# TODO
## Leo
* Figure out alerts
* Figure out email/text confirmation -- LOW PRIORITY
* Add email/text confirmation endpoints -- LOW PRIORITY
* Figure out phone number validation -- LOW PRIORITY
* Add login validation (no 2 people can have same email, etc.) -- LOW PRIORITY
* Separate polling into own module -- LOW PRIORITY
* Implement unwatching to save resources -- LOW PRIORITY

## Larry
* Hook up stuff
* Add login validation on front-end (check for emails)

# Tests (which we should automate)
* Accounts API
  * subscribe (works)
  * unsubscribe (works)
  * add info ??
  * update info ??
  * remove info (currently unsupported)
* Polling API
  * listen (works)
  * key locking (works)
* Confirmation (currently unsupported)
  * email confirmation sent
  * email token works
  * text confirmation sent
  * text confirmation works
* Alerts
  * email alerts work
  * text alerts work
* UI
  * subscribing ??
  * unsubscribing ??
  * account dashboard ??
  * adding info ??
  * changing info ??
  * removing info (currently unsupported)

# Services
## Main
NodeJS
MongoDB (MongoLab)
Redis (RedisToGo)
SendGrid (SendGrid)
Tropo (Tropo)

## Polling
NodeJS
Redis (RedisToGo)

# Future features
* Multiple email/text support on front-end
* Rebuild polling server to use Intercom (or roll own IPC)
* Add failure resistance to polling server (store the list of CCNs to pull out of memory, maybe in Redis?)
* Build public API
