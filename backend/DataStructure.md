# Pass / OffsidePass
Pass has an outcome value of either Successful or Unsuccessful depending
on whether the pass was successful or not

Offside Passes are automatically unsuccessful

Both Pass and Offside Pass are passes which didnt get immediately cut out
and reached a certain other point on the pitch

[
    'id', 
    'eventId', 
    'minute', 
    'second', 
    'teamId', 
    'playerId', 
    'x', 
    'y', 
    'expandedMinute', 
    'period', 
    'type', 
    'outcomeType', (outcomeType.displayName = Successful / Unsuccessful)
    'qualifiers', 
    'satisfiedEventsTypes', 
    'isTouch', 
    'endX', 
    'endY'
]
# BlockedPass
Blocked Passes are passes which traveled barely a meter and was immediately
blocked by an opposing player before it could even have a proper trajectory

[
    'id', 
    'eventId', 
    'minute', 
    'second', 
    'teamId', 
    'playerId', 
    'x', 
    'y', 
    'expandedMinute', 
    'period', 
    'type', 
    'outcomeType', (outcomeType.displayName = Successful / Unsuccessful)
    'qualifiers', 
    'satisfiedEventsTypes', 
    'isTouch', 
]
