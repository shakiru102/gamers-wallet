export default (message?: string | null, data?: any, error?: Error) => {
   if(!error) return { success: true, message , data }
   return { success: false, error: error.message } 
}