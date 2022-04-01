import { strs } from '../../../utils/types'
import { ResizableColumns } from '../../utils/ResizableWidth/ResizableColumns'
import { UBlockContent } from '../types'
import { PaddedBox } from '../UPage/UBlock/PaddedBox'
import { UGridData } from '../UPage/ublockTypes'
import produce from 'immer'
import { UBlocksSet } from '../UPage/UBlockSet/UBlockSet'

export function UGrid({ data: d, setData, id, readonly }: UBlockContent) {
  const data = d as UGridData

  const updateWidths = (widths: strs) => {
    setData(
      id,
      produce(data, (draft) => {
        draft.map((col, i) => (col.width = widths[i]))
      }),
    )
  }
  // readonly is propagated from uform
  return (
    <PaddedBox>
      <ResizableColumns widths={data.map((c) => c.width)} updateWidths={updateWidths}>
        {data.map((column, i) => (
          <UBlocksSet key={i} id={id} blocks={column.ublocks} readonly={readonly} hideFactory={true} />
        ))}
      </ResizableColumns>
    </PaddedBox>
  )
}
