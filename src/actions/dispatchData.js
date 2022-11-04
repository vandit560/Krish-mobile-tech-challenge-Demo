export function dispatchData(params, type) {
    return (disptch, getState) => {
        return new Promise((resolve, reject) => {
            resolve(true)
            console.log("dispatchData :",params,type);
            return disptch({
                type: type, data: params,
            });
            
        })
    }
}