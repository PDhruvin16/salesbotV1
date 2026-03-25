import Realm from 'realm';

export enum RealmSchemaName {
  Example = 'Example',
}

export interface IExample {
  _id: string;
  name: string;
}

export const ExampleSchema: Realm.ObjectSchema = {
  name: RealmSchemaName.Example,
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
  },
};

export const openRealm = async (): Promise<Realm> => {
  return await Realm.open({ schema: [ExampleSchema] });
};

export default Realm;
