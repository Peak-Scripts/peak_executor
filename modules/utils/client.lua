local utils = {}

--- @param message string
--- @param type string
function utils.notify(message, type)
    lib.notify({ 
        position = 'top',
        title = 'Code Executor',
        description = message, 
        style = {
            backgroundColor = '#141517',
            color = '#C1C2C5',
            ['.description'] = {
              color = '#909296'
            }
        },
        type = type 
    })
end

---@param action string
---@param data any
function utils.sendNuiMessage(action, data)
    SendNUIMessage({
        action = action,
        data = data
    })
end

return utils