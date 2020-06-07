interface Transaction {
    date: Date
    description: String
}

export default interface BankData {
    user_id: String
    guild_id: String
    balance: number
    transactions: Transaction[]
}