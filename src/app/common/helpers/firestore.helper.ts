export function parseFirestoreObject(value: any) {
  const props: any = {
    arrayValue: 1,
    bytesValue: 1,
    booleanValue: 1,
    doubleValue: 1,
    geoPointValue: 1,
    integerValue: 1,
    mapValue: 1,
    nullValue: 1,
    referenceValue: 1,
    stringValue: 1,
    timestampValue: 1,
  };

  let newVal = value;
  const prop = Object.keys(newVal).find((k) => props[k] === 1);
  if (prop === 'doubleValue' || prop === 'integerValue') {
    newVal = Number(newVal[prop]);
  } else if (prop === 'arrayValue') {
    newVal = ((newVal[prop] && newVal[prop].values) || []).map((v: any) =>
      parseFirestoreObject(v)
    );
  } else if (prop === 'mapValue') {
    newVal = parseFirestoreObject((newVal[prop] && newVal[prop].fields) || {});
  } else if (prop === 'geoPointValue') {
    newVal = { latitude: 0, longitude: 0, ...newVal[prop] };
  } else if (prop) {
    newVal = newVal[prop];
  } else if (typeof newVal === 'object') {
    Object.keys(newVal).forEach((k) => {
      newVal[k] = parseFirestoreObject(newVal[k]);
    });
  }
  return newVal;
}

export function prepareGetPayload(
  collection: string,
  orderByFieldName: string
) {
  return {
    structuredQuery: {
      from: [
        {
          collectionId: collection,
        },
      ],
      orderBy: [
        {
          field: {
            fieldPath: orderByFieldName,
          },
          direction: 'ASCENDING',
        },
      ],
    },
  };
}
