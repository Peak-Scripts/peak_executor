fx_version 'cerulean'
game 'gta5'

author 'Peak Scripts | KostaZ'
description 'Code Executor'
version '0.0.1'
lua54 'yes'
use_experimental_fxv2_oal 'yes'

shared_scripts {
    '@ox_lib/init.lua'
}

server_scripts { 
    'server.lua' 
}

client_scripts { 
    'client.lua'
}

ui_page 'web/dist/index.html'

files {
    'modules/**/**.lua',
    'web/dist/index.html',
    'web/dist/**/*',
}

