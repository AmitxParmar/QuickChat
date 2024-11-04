type IUserProfile = {
    id?: number
    name: string | null
    email: string | null | undefined
    profilePicture: string | null
    about?: string | null
}

type IMessage = {
    id: number
    type: "text" | "file" | "image"
    message: string
    recieverId: number
    senderId: number
    messageStatus: "sent" | "delivered" | "read"
    reciever: IUserProfile
    sender: IUserProfile
    createdAt: number
}

interface ChatState {
    currentChatUser: IUserProfile | null | undefined
    messages: IMessage[] | []
    addMessage: IMessage | null | undefined
    socket: unknown | null
}

interface UserState {
    userInfo: IUserProfile | null
    newUser: boolean | undefined | null
    contactsPage: boolean | undefined | null
}

