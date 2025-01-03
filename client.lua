local utils = require 'modules.utils.client'
local visible = false

local function toggleUI()
    local isAdmin = lib.callback.await('peak_executor:server:isPlayerAdmin', false)
    if not isAdmin then
        utils.notify('You are not allowed to use this', 'error')
        return
    end

    visible = not visible
    SetNuiFocus(visible, visible)
    utils.sendNuiMessage('setVisible', visible)
end

RegisterNUICallback('executeCode', function(data, cb)
    if not data.code then
        cb({ success = false, output = 'No code provided' })
        return
    end

    local func, err = load(data.code)
    if func then
        local success, result = pcall(func)
        cb({
            success = success,
            output = success and (result or 'Code executed successfully') or result
        })
    else
        cb({
            success = false,
            output = err
        })
    end
end)

RegisterNUICallback('hideFrame', function(_, cb)
    toggleUI()
    cb({})
end)

CreateThread(function()
    while true do
        if visible then
            if IsControlJustReleased(0, 322) then 
                toggleUI()
            end
        end
        Wait(0)
    end
end)


lib.addKeybind({
    name = 'executor',
    description = 'Opens code executor',
    defaultKey = 'F7',
    onPressed = function()
        toggleUI()
    end,
})