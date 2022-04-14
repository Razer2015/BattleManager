wt -d ./services/graphqlService --title graphqlService --suppressApplicationTitle cmd /k "npm i && npm start" ;^
new-tab -d ./services/managementfrontend --title managementfrontend --suppressApplicationTitle cmd /k "npm i && npm start" ;^
new-tab -d ./services/rcon-connector --title rcon-connector --suppressApplicationTitle cmd /k "cargo run"
