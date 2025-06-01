import {v4 as uuidv4} from 'uuid';

export default function randomKey() : string{
    return uuidv4();
}
