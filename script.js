// #popclip extension for ChatGPT
// name: ChatGPT Proofreader
// icon: iconify:fluent:calligraphy-pen-24-regular
// language: javascript
// module: true
// entitlements: [network]
// options: [{
//   identifier: apikey, label: API Key, type: string,
//   description: 'Obtain API key from https://platform.openai.com/account/api-keys'
// }]
async function chat(input, options, mode) {

  let systemPrompt = '';
  let userPrompt = '';

  if (mode == 'ToEn') {
    systemPrompt = '我想让你充当英语翻译员、拼写纠正员和改进员。我会用任何语言与你交谈，你会检测语言，翻译它并用我的文本的更正和改进版本用英语回答。我希望你用更优美优雅的高级英语单词和句子替换我简化的 A0 级单词和句子。保持相同的意思，但使它们更文艺。我要你只回复更正、改进，不要写任何解释。';
    userPrompt = '请翻译下面这句话';
  } else if (mode == 'ToZh') {
    systemPrompt = '我想让你充当中文翻译员、拼写纠正员和改进员. 我会用任何语言与你交谈，你会检测语言，翻译它并用我的文本的更正和改进版本用中文回答。我希望你用更优美优雅的高级中文单词和句子替换我简化的 A0 级单词和句子。保持相同的意思，但使它们更文艺。我要你只回复更正、改进，不要写任何解释。';
    userPrompt = '翻译成简体白话文';
  } else if (mode == 'SumZh') {
    systemPrompt = '我想让你充当中文摘要员, 你只能总结文本，不要解释它。';
    userPrompt = '用最简洁的语言使用中文总结此段文本';
  } else if (mode == 'ProZh') {
    systemPrompt = '你是我的写作助手，检查接收到的文字的拼写、语法错误，对其进行润色，向我提供修改后的文字。';
    userPrompt = '修改和润色下面的文字，直接输出修改后的结果，不需要额外的声明';
  }


  userPrompt = `${userPrompt}:\n\n"${input.text}"`

  const openai = require("axios").create({
    baseURL: "https://api.openai.com/v1",
    headers: { Authorization: `Bearer ${options.apikey}` },
  });

  const { data } = await openai.post("/chat/completions", {
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "system",
        "content": systemPrompt,
      },
      { "role": "user", "content": userPrompt },
    ],
  });
  const result = data.choices[0].message;
  let msg =  input.text.trimEnd() + "\n\n" + result.content.trim();
  // popclip.showText(result)
  return result.content.trim();
};

exports.actions = [
  {
    title: "ToEn",
    after: "paste-result",
    code: async (input, options) => chat(input, options, "ToEn"),
  },
  {
    title: "ToZh",
    after: "show-result",
    code: async (input, options) => chat(input, options, "ToZh"),
  },
  {
    title: "SumZh",
    after: "show-result",
    code: async (input, options) => chat(input, options, "SumZh"),
  },
  {
    title: "ProZh",
    after: "paste-result",
    code: async (input, options) => chat(input, options, "ProZh"),
  }
];
