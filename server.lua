lib.versionCheck('Peak-Scripts/peak_executor')

lib.callback.register('peak_executor:server:isPlayerAdmin', function()
    return IsPlayerAceAllowed(source, 'command')
end)
