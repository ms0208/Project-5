import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema[
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        documents:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Document',
            required:true,
        },
        cards:[
            {
                questions:{type:String,required:true},
                answer:{type:String,required:true},
                difficulty:{
                    type:String,
                    enum:['easy','medium','hard'],
                    default:'medium',
                },
                lastRecived:{
                    type:Date,
                    default:null,
                },
                reviewCount:{
                    type:Number,
                    default:0,
                },
                isStarred:{
                    type:Boolean,
                    default:true,
                }
            }
        ]
    },
    {
        timestamps:true,
    }
];
flashcardSchema.index[{userId:1,documents:1}];
const flashcard = mongoose.model('flashcard',flashcardSchema);
export default flashcard;