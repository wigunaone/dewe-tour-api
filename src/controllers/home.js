exports.showhome = async (req, res) => {
    try{
        res.send({
            status: "Success",
            message: "Welcome"
        })
    }catch(error){
        console.log(error);
        res.send({
            status: 'failed',
            message: "Server Error"
        })
    }
}