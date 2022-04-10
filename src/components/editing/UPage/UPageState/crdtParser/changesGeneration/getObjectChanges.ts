import { applyStrChanges, getStrChanges, StrChanges, _strChanger } from './getStrChange'
import { str } from '../../../../../../utils/types'
import { UBlockData } from '../../../ublockTypes'

export function getObjectChanges(old: str, cur: str): StrChanges {
  return getStrChanges(old, cur, { shortenPreview: false, ignoreConstantText: true })
}

export function _applyObjectChanges(old: UBlockData, changes: StrChanges): UBlockData {
  const changer = _strChanger(JSON.stringify(old))
  applyStrChanges(changer, changes)
  return JSON.parse(changer.toJSON())
}
