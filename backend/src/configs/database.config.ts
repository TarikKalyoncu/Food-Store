import mongoose, {connect, ConnectOptions} from 'mongoose';

const uri = '';

export const dbConnect = () => {
    mongoose.set('strictQuery', false);
    connect(uri!, {
        
        useNewUrlParser: true,
        useUnifiedTopology: true
    } as ConnectOptions).then(
        () => console.log("connect successfully"),
        (error) => console.log(error)
    )
}

