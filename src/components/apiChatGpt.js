const {Configuration,OpenAIApi} = require("openai")
const configuration = new Configuration({
    apiKey:"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",
});
const openai = new OpenAIApi(configuration);
export async function ResponseGPT(){
    const complete = await openai.createCompletion({
        model:"text-davinci-003",
        prompt:"How are you today ?",
        temperature: 0.6,
    })
    console.log(complete.data.choices[0].text);





}