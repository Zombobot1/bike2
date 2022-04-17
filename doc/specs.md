##Frontend-Backend Interactions

###Abstractions on top of `reactfire` 
####_useData_

`useData` is contolled by two flags: `createIfNotExists` and `avoidCreation`, both `false` by default.

**IMPORTANT:** **Requires manual testing**, pay special attention when adding changes.
*✓ means that story is automatically tested*

- if doc doesn't exist and initial data not provided it fails
- if doc exists it returns doc

- if doc exists and initial data provided it returns initial data, then doc
- if doc doesn't exist and initial data provided, doc will be created from initial data and initial data will be returned
- if doc doesn't exist and initial data provided + avoidCreation, initial data will be returned
- if doc doesn't exist and initial data provided + createIfNotExists, doc will be created first from initial data, then returned

| doc         | initial     | createIfNotExists | avoidCreation | Story Name                     |
|-------------|-------------|-------------------|---------------|--------------------------------|
| `undefined` | `undefined` | `false`           | `false`       | Fail404 ✓                      |
| `undefined` | provided    | `true`            | `true`        | FailCollidingFlags             |
| exists      | `undefined` | `false`           | `false`       | ExistingData ✓                 |
| exists      | provided    | `false`           | `false`       | InstantInitialThenExistingData |
| `undefined` | provided    | `false`           | `false`       | InstantInitialDataThenDoc      |
| `undefined` | provided    | `false`           | `true`        | InstantInitialData             |
| `undefined` | provided    | `true`            | `false`       | DocCreatedFirst                |

####_useCollectionData_
Testing is not required (just a wrapper on top of reactfire `useFirestoreCollectionData`)

Used in `IdeasViewer.stories.tsx` => `SeeExistingAndCreateNew`

###Backend
A set of typed wrappers on top of firestore SDK.

- setData
- getData
- appendToArray

`setData`, `getData` and `appendToArray` are used in `UPage.stories.tsx` => `MoveBlocks`

###FileUploader
####_upload_
Uploads a file to firebase storage.
####_delete_
Adds `{src, upageID}` of file to `deletedFiles` collection.

Upload and delete processes are used in `UBlockSet.stories.tsx` => `PastesAndDeletesImage`
