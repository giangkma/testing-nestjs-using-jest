import { ObjectID } from 'mongodb';

interface Converter<TConvertSource, TConvertDestination> {
    convert(source: TConvertSource): TConvertDestination;
}

/**
 * Convert objectid property in class to string property in other class
 *
 * @export
 * @param {unknown} value
 * @returns {string}
 */
export class ObjectIDStringConverter implements Converter<ObjectID, string> {
    convert(source: ObjectID): string {
        // handle validation here if you like
        return source.toHexString();
    }
}

export class ObjectIDsStringsConverter implements Converter<ObjectID[], string[]> {
    convert(source: ObjectID[]): string[] {
        // handle validation here if you like
        return source.map(new ObjectIDStringConverter().convert)
    }
}


export class StringObjectIDConverter implements Converter<string, ObjectID> {
    convert(source: string): ObjectID {
        // handle validation here if you like
        return ObjectID.createFromHexString(source)
    }
}


export class StringsObjectIDsConverter implements Converter<string[], ObjectID[]> {
    convert(source: string[]): ObjectID[] {
        // handle validation here if you like
        return source.map(new StringObjectIDConverter().convert)
    }
}
