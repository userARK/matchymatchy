#!/bin/bash
#assumes the list is sorted by database name
#run as ./dbparser.sh filename.csv
 
UNIQUE_TABLENAMES="var tableNames=["
COUNTER=1
CHECKBOXES="var checkboxes = {"
touch output.txt
while IFS=',' read -r name value
do
        if ! echo $UNIQUE_TABLENAMES | tr '\"' '\n' | grep -q $name ; then
                UNIQUE_TABLENAMES+="\"$name\","
                CHECKBOXES+="$name : table$COUNTER, "
                echo "var table$COUNTER = [\"$value\"];" >> output.txt
                echo >> output.txt
                ((COUNTER++))
        else
                temp=1
                temp="$(($COUNTER-$temp))"
                sed -i "/var table$temp/{s/\];/,\"$value\"\];/g}" output.txt
        fi
done < "$1"
 
UNIQUE_TABLENAMES=${UNIQUE_TABLENAMES%?}
CHECKBOXES=${CHECKBOXES%??}
 
UNIQUE_TABLENAMES+="];"
CHECKBOXES+="};"
echo $UNIQUE_TABLENAMES >> output.txt
echo $CHECKBOXES >> output.txt
