import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, NumericTypes, Types } from 'mongoose';

export type CharacterDocument = Character & Document;

@Schema()
export class Character {
    _id: Types.ObjectId;

    @Prop({required: true})
    price: number;

    @Prop({required: true})
    modified: Date;

    @Prop({required: false})
    description: string;
    
    @Prop({required: false})
    thumbnail: string;

    @Prop({ type: Types.ObjectId, ref: 'users' })
    userId: Types.ObjectId;
}

export const CharacterSchema = SchemaFactory.createForClass(Character);

