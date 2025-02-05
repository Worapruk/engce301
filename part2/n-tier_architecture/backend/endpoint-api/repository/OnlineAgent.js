const sql = require('mssql');
const sqlConfig = require('../sqlConfig')['development'];
const { v4: uuid } = require('uuid');

console.log("sqlConfig: ", sqlConfig);

async function getOnlineAgentByAgentCode(agentcode) {
    try {
        console.log("agentcode: ", agentcode);

        let pool = await sql.connect(sqlConfig);

        // Use parameterized query to avoid SQL injection
        let result = await pool.request()
            .input('agentcode', sql.VarChar(20), agentcode)
            .query('SELECT * FROM [OnlineAgents] WHERE [agent_code] = @agentcode');

        console.log("result: ", result);

        if (!result || result.recordsets[0].length === 0) {
            console.log("result: ERROR");
            return {
                error: true,
                statusCode: 404,
                errMessage: 'Agent not found',
            };
        } else {
            return {
                error: false,
                statusCode: 200,
                data: result.recordset[0],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            error: true,
            statusCode: 500,
            errMessage: 'An internal server error occurred',
        };
    }
}

async function postOnlineAgentStatus(AgentCode, AgentName, IsLogin, AgentStatus) {
    console.log("----------------");
    console.log("AgentCode: " + AgentCode);
    console.log("AgentName: " + AgentName);
    console.log("IsLogin: " + IsLogin);
    console.log("AgentStatus: " + AgentStatus);

    try {
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();

        const uniqueId = uuid(); // Generate a unique UUID for the agent

        // Check if the agent already exists
        let result = await request
            .input('AgentCode', sql.VarChar(20), AgentCode)
            .query('SELECT * FROM [OnlineAgents] WHERE [agent_code] = @AgentCode');

        if (!result || result.recordsets[0].length === 0) {
            // Agent does not exist, insert new record
            let insertQuery = `
                INSERT INTO [OnlineAgents] (agent_code, uuid, AgentName, IsLogin, AgentStatus)
                OUTPUT inserted.agent_code, inserted.uuid, inserted.StartOnline
                VALUES (@AgentCode, @uuid, @AgentName, @IsLogin, @AgentStatus)
            `;

            let result2 = await request
                .input('AgentCode', sql.VarChar(20), AgentCode)
                .input('uuid', sql.VarChar(50), uniqueId)
                .input('AgentName', sql.VarChar(20), AgentName)
                .input('IsLogin', sql.Char(1), IsLogin)
                .input('AgentStatus', sql.Char(1), AgentStatus)
                .query(insertQuery);

            console.dir(result2.recordset[0]);

            return {
                error: false,
                statusCode: 200,
                data: 'Agent was inserted, status has been set also',
            };
        } else {
            // Agent exists, update the record
            let updateQuery = `
                UPDATE [OnlineAgents]
                SET [AgentName] = @AgentName, [IsLogin] = @IsLogin, [AgentStatus] = @AgentStatus
                WHERE [agent_code] = @AgentCode
            `;

            let result2 = await request
                .input('AgentName', sql.VarChar(20), AgentName)
                .input('IsLogin', sql.Char(1), IsLogin)
                .input('AgentStatus', sql.Char(1), AgentStatus)
                .input('AgentCode', sql.VarChar(20), AgentCode)
                .query(updateQuery);

            console.dir(result2);

            return {
                error: false,
                statusCode: 200,
                data: 'Agent was updated',
            };
        }
    } catch (error) {
        console.log(error);
        return {
            error: true,
            statusCode: 500,
            errMessage: 'An internal server error occurred',
        };
    }
}

module.exports.OnlineAgentRepo = {
    getOnlineAgentByAgentCode,
    postOnlineAgentStatus,
};