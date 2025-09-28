import { figure } from "&core/Figure";
import { randomItem } from "&utils/array";
import { clone } from "&utils/clone";
import { random } from "./random";

export const figures = [
  figure(
    '    ',
    '####',
  ).color('#1FEFEC'),

  figure(
    '#  ',
    '###',
  ).color('#6c6cd0ff'),

  figure(
    '  #',
    '###',
  ).color('#EA8F08'),

  figure(
    '##',
    '##'
  ).color('#EDF10A'),

  figure(
    '## ',
    ' ##',
  ).color('#20F307'),

  figure(
    ' # ',
    '###',
  ).color('#bc97d5ff'),

  figure(
    ' ##',
    '## ',
  ).color('#E90007'),
];

export function getFigure() {
  return clone(randomItem(figures, random));
}