for /f %%i in ('git rev-parse --short HEAD') do set SHORT_HASH=%%i

set /p VERSION="the version \(ex. 0.1.1\): " || SET "VERSION=local"
set /p GRAPHQL_ENDPOINT="enter the graphql endpoint \(ex. http://localhost:4000/graphql\): " || SET "GRAPHQL_ENDPOINT=http://localhost:4000/graphql"

wt --title graphqlService cmd /k "TITLE=building - graphqlService && docker build -t xfilefin/battlemanager-graphqlservice:%VERSION% ./services/graphqlService/ && TITLE=pushing - graphqlService && docker push xfilefin/battlemanager-graphqlservice:%VERSION% && TITLE=finished - graphqlService" ;^
new-tab --title managementFrontend cmd /k "TITLE=building - managementFrontend && docker build -t xfilefin/battlemanager-managementfrontend:%VERSION% --build-arg REACT_APP_GRAPHQL_HOST=%GRAPHQL_ENDPOINT% ./services/managementfrontend/ && TITLE=pushing - managementFrontend && docker push xfilefin/battlemanager-managementfrontend:%VERSION% && TITLE=finished - managementFrontend" ;^
new-tab --title rconconnector cmd /k "TITLE=building - rconconnector && docker build -t xfilefin/battlemanager-rconconnector:%VERSION% ./services/rcon-connector/ && TITLE=finished - rconconnector"
