import { ObjectId } from 'mongodb'

// Utility functions for MongoDB ObjectId handling

export function toObjectId(id: string): ObjectId {
  return new ObjectId(id)
}

export function isValidObjectId(id: string): boolean {
  return ObjectId.isValid(id)
}

export function fromObjectId(objectId: ObjectId): string {
  return objectId.toString()
}

// Helper to convert string IDs to ObjectIds for queries
export function convertToObjectIds(ids: string[]): ObjectId[] {
  return ids.map(id => toObjectId(id))
}

// Helper to convert ObjectIds to strings for responses
export function convertToStrings(objectIds: ObjectId[]): string[] {
  return objectIds.map(id => fromObjectId(id))
}
