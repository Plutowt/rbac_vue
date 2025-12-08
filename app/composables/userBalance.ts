export const userBalance = defineStore('balance', ()=>{
    const posted_balance = ref<number | null>(null)
    const pending_balance = ref<number | null>(null)
    const loading = ref(false)
    const nowerror = ref<string | null>(null)

    async function fetchBalance() {
        if (loading.value) return
        loading.value = true
        nowerror.value = null

        const {balanceBalanceLookupAccount} = useApiV1Client()
        const {data,error} = await balanceBalanceLookupAccount()

        try{
            if(error) console.log(error)
            posted_balance.value = data.posted_balance
            pending_balance.value = data.pending_balance
        }catch(e){
            console.error('余额获取失败',e)
            nowerror.value = '余额获取失败'
        }finally{
            loading.value = false
        }
    }

    onMounted(()=>{
        fetchBalance()
    })
    return{
        posted_balance,
        pending_balance,
        loading,
        nowerror,
        fetchBalance
    }
})