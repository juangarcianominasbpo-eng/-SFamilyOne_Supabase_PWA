export function stripEmojis(input){
  return input.replace(/[\u{1F600}-\u{1F6FF}|\u{1F300}-\u{1F5FF}|\u{1F900}-\u{1F9FF}|\u{1FA70}-\u{1FAFF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]/gu, '')
}
