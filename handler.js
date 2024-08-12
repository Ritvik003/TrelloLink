const axios = require('axios');

module.exports.Cards = async (event) => {
    const {srcCardId, destCardId} = JSON.parse(event.body);
    const trelloApiKey = 'key_here';
    const trelloApiToken = 'token_here';

    try {
        
        const srcCardResponse = await axios.get(`https://api.trello.com/1/cards/${srcCardId}?key=${trelloApiKey}&token=${trelloApiToken}`);
        const srcCardData = srcCardResponse.data;
        console.log('Source Card Data:', srcCardData);

        
        const updateResponse = await axios.put(`https://api.trello.com/1/cards/${destCardId}?key=${trelloApiKey}&token=${trelloApiToken}`, {
            name: srcCardData.name,
            desc: srcCardData.desc
        });
        console.log('Update Response:', updateResponse.data);

        
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Cards synced successfully!', data: updateResponse.data }),
        };
    } catch (error) {
        console.error('Failed API request', error.response ? `${error.response.status} - ${JSON.stringify(error.response.data)}` : error.message);
        return {
            statusCode: error.response ? error.response.status : 500,
            body: JSON.stringify({
                message: 'Error syncing cards',
                error: error.message,
                details: error.response ? error.response.data : null
            })
        };
    }
};
