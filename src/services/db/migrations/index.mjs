import v001 from './20221201.001.mjs';
import v002 from './20221203.002.mjs';

const migrations = [
    v001,
    v002,
];

export const LATEST = migrations.length;

export default  migrations;