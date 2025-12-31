import { useEffect } from "react";
import { useChatbot } from "../../hooks/useChatbot";

function ChatBot() {
  const { sendMessage, messages } = useChatbot();
  console.log(messages)
  useEffect(() => {
    sendMessage("what is tailwind").then((res) => console.log(res));
  }, []); 

  return <div>chatbot</div>;
}

export default ChatBot;
