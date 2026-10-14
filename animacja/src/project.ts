import {makeProject} from '@motion-canvas/core';
import bisekcja from './scenes/bisekcja?scene';
import calkowanie from './scenes/calkowanie?scene';

export default makeProject({
  scenes: [bisekcja, calkowanie],
});
