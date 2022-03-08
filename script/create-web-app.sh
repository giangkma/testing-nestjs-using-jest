
#!/bin/bash

# Delete old group?
group=samla2
az group delete --name $group --no-wait

# Create group
az group create --name $group --location "West Europe"

# Deployment setup - create git user that will do deployment form local repo
deployuser=samladeploy
deploypwd=!sam3113mas!
az webapp deployment user set --user-name $deployuser --password $deploypwd

# Assign roles to group
## Get users
#az ad user list --query "[].{id: objectId, name:userPrincipalName}"
## List roles
#az role definition list --query "[].{name:name, roleType:roleType, roleName:roleName}" --output tsv
# Set role
role="Owner"
az role assignment create --assignee "tunguyen.bhtech_gmail.com#EXT#@olemlfreitech.onmicrosoft.com" \
    --role $role \
    --resource-group $group
az role assignment create --assignee "varpe1992_gmail.com#EXT#@olemlfreitech.onmicrosoft.com" \
    --role $role \
    --resource-group $group

# Create apps
# az webapp list-runtimes --linux | grep NODE
plan=samlaServicePlan
server=samla-server
creator=samla-creator
branch=master
az appservice plan create --name $plan --resource-group $group --sku B1 --is-linux
az webapp create --resource-group $group --plan $plan --name $server --runtime "NODE|12-lts" --deployment-local-git --deployment-source-branch $branch
az webapp create --resource-group $group --plan $plan --name $creator --runtime "NODE|12-lts" --deployment-local-git --deployment-source-branch $branch

# Setup database
db=samla-database
az cosmosdb create --name $db --resource-group $group --kind MongoDB
az cosmosdb list-keys --name $db --resource-group $group

key=$(az cosmosdb list-keys --name $db --resource-group $group | grep primaryMasterKey | sed -e 's/.*: "\(.*\)",/\1/')

# Configure server

# Api
az webapp config appsettings set --name $server --resource-group $group --settings JWT_SECRET="a4c15af1eb5ef72c5126d28251e2a6dc38d56abcd430571744c0f791e6933ad9"
az webapp config appsettings set --name $server --resource-group $group --settings TOKEN_EXPIRE_IN="1d"
az webapp config appsettings set --name $server --resource-group $group --settings PASSWORD_HASH_SALT=10

# Database
az webapp config appsettings set --name $server --resource-group $group --settings DATABASE_HOST="samla-database.documents.azure.com"
az webapp config appsettings set --name $server --resource-group $group --settings DATABASE_PORT="10255"
az webapp config appsettings set --name $server --resource-group $group --settings DATABASE_USERNAME="$db"
az webapp config appsettings set --name $server --resource-group $group --settings DATABASE_PASSWORD="$key"
az webapp config appsettings set --name $server --resource-group $group --settings DATABASE_AUTH_SOURCE="admin"
az webapp config appsettings set --name $server --resource-group $group --settings DATABASE_SSL="true"
az webapp config appsettings set --name $server --resource-group $group --settings DATABASE_NAME="$db"

# Add git remote
#git remote add azure https://$deplouuser@$server.scm.azurewebsites.net/$server.git
#git remote add azure https://$deplouuser@$creator.scm.azurewebsites.net/$creator.git
