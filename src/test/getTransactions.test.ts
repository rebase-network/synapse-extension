import { Ckb } from "../utils/constants";
const CKB = require('@nervosnetwork/ckb-sdk-core').default
const ckb = new CKB("http://101.200.147.143:8117/rpc")
import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils';

export const EMPTY_TX_HASH =
    '0x0000000000000000000000000000000000000000000000000000000000000000';

const txListObjects = [
    {
        "block_number": "0x20b75",
        "io_index": "0x0",
        "io_type": "output",
        "tx_hash": "0xbc6f08a52e02ff06b825d0bf85fd150c194b2fb2fb149c13ca6eab909b999ffc",
        "tx_index": "0x1"
    },
    {
        "block_number": "0x20b95",
        "io_index": "0x0",
        "io_type": "input",
        "tx_hash": "0x1cb41bd161ae75f94e9019afa0e7f98297f5404272dfe8de268f977cbbebc1a2",
        "tx_index": "0x1"
    },
    {
        "block_number": "0x20b95",
        "io_index": "0x1",
        "io_type": "output",
        "tx_hash": "0x1cb41bd161ae75f94e9019afa0e7f98297f5404272dfe8de268f977cbbebc1a2",
        "tx_index": "0x1"
    },
    // {
    //     "block_number": "0x20ba6",
    //     "io_index": "0x0",
    //     "io_type": "input",
    //     "tx_hash": "0xd650b6cdf0100f2dc2a59857b1881cbfab74b24e1a5ce2d9d2ebe2fbf625032b",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x20ba6",
    //     "io_index": "0x1",
    //     "io_type": "output",
    //     "tx_hash": "0xd650b6cdf0100f2dc2a59857b1881cbfab74b24e1a5ce2d9d2ebe2fbf625032b",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x219ee",
    //     "io_index": "0x0",
    //     "io_type": "input",
    //     "tx_hash": "0x254e6fd9954b08784ef7e210e5efb9651505eda56f184429c993b1b40c73324e",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x219ee",
    //     "io_index": "0x1",
    //     "io_type": "output",
    //     "tx_hash": "0x254e6fd9954b08784ef7e210e5efb9651505eda56f184429c993b1b40c73324e",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x23875",
    //     "io_index": "0x0",
    //     "io_type": "input",
    //     "tx_hash": "0x8d562e1b7972966e82e866580bb1fe3228023a7b50813ea42a317067ee692282",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x23875",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0x8d562e1b7972966e82e866580bb1fe3228023a7b50813ea42a317067ee692282",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x23875",
    //     "io_index": "0x1",
    //     "io_type": "output",
    //     "tx_hash": "0x8d562e1b7972966e82e866580bb1fe3228023a7b50813ea42a317067ee692282",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x23896",
    //     "io_index": "0x0",
    //     "io_type": "input",
    //     "tx_hash": "0x70fc933b594e49ca0ccae4ef6121d3527a32f4b9485c3f9ee14f8617614418f8",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x23896",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0x70fc933b594e49ca0ccae4ef6121d3527a32f4b9485c3f9ee14f8617614418f8",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x23896",
    //     "io_index": "0x1",
    //     "io_type": "input",
    //     "tx_hash": "0x70fc933b594e49ca0ccae4ef6121d3527a32f4b9485c3f9ee14f8617614418f8",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x23896",
    //     "io_index": "0x1",
    //     "io_type": "output",
    //     "tx_hash": "0x70fc933b594e49ca0ccae4ef6121d3527a32f4b9485c3f9ee14f8617614418f8",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x238d6",
    //     "io_index": "0x0",
    //     "io_type": "input",
    //     "tx_hash": "0xcb9e58f192531bd773a694b344269398dc5f5ee2c10844f931cdaff5a2e2fdbe",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x238d6",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0xcb9e58f192531bd773a694b344269398dc5f5ee2c10844f931cdaff5a2e2fdbe",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x238d6",
    //     "io_index": "0x1",
    //     "io_type": "input",
    //     "tx_hash": "0xcb9e58f192531bd773a694b344269398dc5f5ee2c10844f931cdaff5a2e2fdbe",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x238d6",
    //     "io_index": "0x1",
    //     "io_type": "output",
    //     "tx_hash": "0xcb9e58f192531bd773a694b344269398dc5f5ee2c10844f931cdaff5a2e2fdbe",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x238f3",
    //     "io_index": "0x0",
    //     "io_type": "input",
    //     "tx_hash": "0x0e78d2b553892542f8d7203a7a4660f16456738b265a800b2f572bb5f5402dd0",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x238f3",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0x0e78d2b553892542f8d7203a7a4660f16456738b265a800b2f572bb5f5402dd0",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x238f3",
    //     "io_index": "0x1",
    //     "io_type": "input",
    //     "tx_hash": "0x0e78d2b553892542f8d7203a7a4660f16456738b265a800b2f572bb5f5402dd0",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x238f3",
    //     "io_index": "0x1",
    //     "io_type": "output",
    //     "tx_hash": "0x0e78d2b553892542f8d7203a7a4660f16456738b265a800b2f572bb5f5402dd0",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x239b0",
    //     "io_index": "0x0",
    //     "io_type": "input",
    //     "tx_hash": "0x1dc516d839d99acaf1faf98cdae1ad959dba122151b9ac705a984df2642b7c0d",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x239b0",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0x1dc516d839d99acaf1faf98cdae1ad959dba122151b9ac705a984df2642b7c0d",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x239b0",
    //     "io_index": "0x1",
    //     "io_type": "input",
    //     "tx_hash": "0x1dc516d839d99acaf1faf98cdae1ad959dba122151b9ac705a984df2642b7c0d",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x239b0",
    //     "io_index": "0x1",
    //     "io_type": "output",
    //     "tx_hash": "0x1dc516d839d99acaf1faf98cdae1ad959dba122151b9ac705a984df2642b7c0d",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x23a50",
    //     "io_index": "0x0",
    //     "io_type": "input",
    //     "tx_hash": "0xb18bae2bfaf9ddcb8afe237e266ff5e616ca5356f9525e576719476cd37a9b90",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x23a50",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0xb18bae2bfaf9ddcb8afe237e266ff5e616ca5356f9525e576719476cd37a9b90",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x23a50",
    //     "io_index": "0x1",
    //     "io_type": "input",
    //     "tx_hash": "0xb18bae2bfaf9ddcb8afe237e266ff5e616ca5356f9525e576719476cd37a9b90",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x23a50",
    //     "io_index": "0x1",
    //     "io_type": "output",
    //     "tx_hash": "0xb18bae2bfaf9ddcb8afe237e266ff5e616ca5356f9525e576719476cd37a9b90",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x25a0b",
    //     "io_index": "0x0",
    //     "io_type": "input",
    //     "tx_hash": "0xa7aa02bd442cd67580eb48e9fe6927df4dd034c5d6f859126059a3a0c52828b8",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x25a0b",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0xa7aa02bd442cd67580eb48e9fe6927df4dd034c5d6f859126059a3a0c52828b8",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x25a0b",
    //     "io_index": "0x1",
    //     "io_type": "input",
    //     "tx_hash": "0xa7aa02bd442cd67580eb48e9fe6927df4dd034c5d6f859126059a3a0c52828b8",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x25a0b",
    //     "io_index": "0x1",
    //     "io_type": "output",
    //     "tx_hash": "0xa7aa02bd442cd67580eb48e9fe6927df4dd034c5d6f859126059a3a0c52828b8",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x25a1e",
    //     "io_index": "0x0",
    //     "io_type": "input",
    //     "tx_hash": "0x56d42557a9817ddb2ed302b38325d2762a9654c5a67120552fdf68902fecaaa3",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x25a1e",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0x56d42557a9817ddb2ed302b38325d2762a9654c5a67120552fdf68902fecaaa3",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x25a1e",
    //     "io_index": "0x1",
    //     "io_type": "input",
    //     "tx_hash": "0x56d42557a9817ddb2ed302b38325d2762a9654c5a67120552fdf68902fecaaa3",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x25a1e",
    //     "io_index": "0x1",
    //     "io_type": "output",
    //     "tx_hash": "0x56d42557a9817ddb2ed302b38325d2762a9654c5a67120552fdf68902fecaaa3",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x25a38",
    //     "io_index": "0x0",
    //     "io_type": "input",
    //     "tx_hash": "0xa4b2d836d006ac2d157605306e2c26682487fdeb0c04c05c9740fc395e125a49",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x25a38",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0xa4b2d836d006ac2d157605306e2c26682487fdeb0c04c05c9740fc395e125a49",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x25a38",
    //     "io_index": "0x1",
    //     "io_type": "input",
    //     "tx_hash": "0xa4b2d836d006ac2d157605306e2c26682487fdeb0c04c05c9740fc395e125a49",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x25a38",
    //     "io_index": "0x1",
    //     "io_type": "output",
    //     "tx_hash": "0xa4b2d836d006ac2d157605306e2c26682487fdeb0c04c05c9740fc395e125a49",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x25a6e",
    //     "io_index": "0x0",
    //     "io_type": "input",
    //     "tx_hash": "0x36a83831640f00f2eb16c1ba22702fe8cc375590104cc2d21fd25e9b83c7fc4f",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x25a6e",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0x36a83831640f00f2eb16c1ba22702fe8cc375590104cc2d21fd25e9b83c7fc4f",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x25a6e",
    //     "io_index": "0x1",
    //     "io_type": "input",
    //     "tx_hash": "0x36a83831640f00f2eb16c1ba22702fe8cc375590104cc2d21fd25e9b83c7fc4f",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x25a6e",
    //     "io_index": "0x1",
    //     "io_type": "output",
    //     "tx_hash": "0x36a83831640f00f2eb16c1ba22702fe8cc375590104cc2d21fd25e9b83c7fc4f",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2720f",
    //     "io_index": "0x0",
    //     "io_type": "input",
    //     "tx_hash": "0xa95df75273835b3ee25de34eb7c603727fd4fc15eb21a21fc57882b36bb732d4",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2720f",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0xa95df75273835b3ee25de34eb7c603727fd4fc15eb21a21fc57882b36bb732d4",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2720f",
    //     "io_index": "0x1",
    //     "io_type": "input",
    //     "tx_hash": "0xa95df75273835b3ee25de34eb7c603727fd4fc15eb21a21fc57882b36bb732d4",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2720f",
    //     "io_index": "0x1",
    //     "io_type": "output",
    //     "tx_hash": "0xa95df75273835b3ee25de34eb7c603727fd4fc15eb21a21fc57882b36bb732d4",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x27255",
    //     "io_index": "0x0",
    //     "io_type": "input",
    //     "tx_hash": "0xc84740db291e85960dcbbfe7668f422adaa9b097bdd382511cfa86026ea3343b",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x27255",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0xc84740db291e85960dcbbfe7668f422adaa9b097bdd382511cfa86026ea3343b",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x27255",
    //     "io_index": "0x1",
    //     "io_type": "input",
    //     "tx_hash": "0xc84740db291e85960dcbbfe7668f422adaa9b097bdd382511cfa86026ea3343b",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x27255",
    //     "io_index": "0x1",
    //     "io_type": "output",
    //     "tx_hash": "0xc84740db291e85960dcbbfe7668f422adaa9b097bdd382511cfa86026ea3343b",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x27ac8",
    //     "io_index": "0x0",
    //     "io_type": "input",
    //     "tx_hash": "0x4d284ea3371adeca16a4de9a3ebdec4760a626c583701e52c8aab3f846488f15",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x27ac8",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0x4d284ea3371adeca16a4de9a3ebdec4760a626c583701e52c8aab3f846488f15",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x27ac8",
    //     "io_index": "0x1",
    //     "io_type": "input",
    //     "tx_hash": "0x4d284ea3371adeca16a4de9a3ebdec4760a626c583701e52c8aab3f846488f15",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x27ac8",
    //     "io_index": "0x1",
    //     "io_type": "output",
    //     "tx_hash": "0x4d284ea3371adeca16a4de9a3ebdec4760a626c583701e52c8aab3f846488f15",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x27c5e",
    //     "io_index": "0x0",
    //     "io_type": "input",
    //     "tx_hash": "0xea16087b9bad190f71121c4604b869e95cfcd1b018271fa94d1ba11c479dfa6b",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x27c5e",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0xea16087b9bad190f71121c4604b869e95cfcd1b018271fa94d1ba11c479dfa6b",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x27c5e",
    //     "io_index": "0x1",
    //     "io_type": "input",
    //     "tx_hash": "0xea16087b9bad190f71121c4604b869e95cfcd1b018271fa94d1ba11c479dfa6b",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x27c5e",
    //     "io_index": "0x1",
    //     "io_type": "output",
    //     "tx_hash": "0xea16087b9bad190f71121c4604b869e95cfcd1b018271fa94d1ba11c479dfa6b",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x27faa",
    //     "io_index": "0x0",
    //     "io_type": "input",
    //     "tx_hash": "0x74470cbd5d33cc351b66276ce07f62fce15c47291179331091be516da4ec6eed",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x27faa",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0x74470cbd5d33cc351b66276ce07f62fce15c47291179331091be516da4ec6eed",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x27faa",
    //     "io_index": "0x1",
    //     "io_type": "input",
    //     "tx_hash": "0x74470cbd5d33cc351b66276ce07f62fce15c47291179331091be516da4ec6eed",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x27faa",
    //     "io_index": "0x1",
    //     "io_type": "output",
    //     "tx_hash": "0x74470cbd5d33cc351b66276ce07f62fce15c47291179331091be516da4ec6eed",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x27ffb",
    //     "io_index": "0x0",
    //     "io_type": "input",
    //     "tx_hash": "0x7337a034efd8c75e16efa5879893823195abc305e70e8095c54297bde7e57850",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x27ffb",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0x7337a034efd8c75e16efa5879893823195abc305e70e8095c54297bde7e57850",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x27ffb",
    //     "io_index": "0x1",
    //     "io_type": "input",
    //     "tx_hash": "0x7337a034efd8c75e16efa5879893823195abc305e70e8095c54297bde7e57850",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x27ffb",
    //     "io_index": "0x1",
    //     "io_type": "output",
    //     "tx_hash": "0x7337a034efd8c75e16efa5879893823195abc305e70e8095c54297bde7e57850",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2806e",
    //     "io_index": "0x0",
    //     "io_type": "input",
    //     "tx_hash": "0xabb7eb66b25d30bfe1bf048cd8ea9696aa7a08e7dec29ba8cbf48af2d4daa877",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2806e",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0xabb7eb66b25d30bfe1bf048cd8ea9696aa7a08e7dec29ba8cbf48af2d4daa877",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2806e",
    //     "io_index": "0x1",
    //     "io_type": "input",
    //     "tx_hash": "0xabb7eb66b25d30bfe1bf048cd8ea9696aa7a08e7dec29ba8cbf48af2d4daa877",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2806e",
    //     "io_index": "0x1",
    //     "io_type": "output",
    //     "tx_hash": "0xabb7eb66b25d30bfe1bf048cd8ea9696aa7a08e7dec29ba8cbf48af2d4daa877",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2a3ba",
    //     "io_index": "0x0",
    //     "io_type": "input",
    //     "tx_hash": "0x5d86ffc0ee9f12676b9707c75fbe93230a5c325a9bca3c670501047db70543dc",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2a3ba",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0x5d86ffc0ee9f12676b9707c75fbe93230a5c325a9bca3c670501047db70543dc",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2a3ba",
    //     "io_index": "0x1",
    //     "io_type": "input",
    //     "tx_hash": "0x5d86ffc0ee9f12676b9707c75fbe93230a5c325a9bca3c670501047db70543dc",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2a3ba",
    //     "io_index": "0x1",
    //     "io_type": "output",
    //     "tx_hash": "0x5d86ffc0ee9f12676b9707c75fbe93230a5c325a9bca3c670501047db70543dc",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2a3eb",
    //     "io_index": "0x0",
    //     "io_type": "input",
    //     "tx_hash": "0x1e62e5518897608032269ea70e65d5455e42d1c11435bf6ae7470bcd39c7c392",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2a3eb",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0x1e62e5518897608032269ea70e65d5455e42d1c11435bf6ae7470bcd39c7c392",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2a3eb",
    //     "io_index": "0x1",
    //     "io_type": "input",
    //     "tx_hash": "0x1e62e5518897608032269ea70e65d5455e42d1c11435bf6ae7470bcd39c7c392",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2a3eb",
    //     "io_index": "0x1",
    //     "io_type": "output",
    //     "tx_hash": "0x1e62e5518897608032269ea70e65d5455e42d1c11435bf6ae7470bcd39c7c392",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2be83",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0xbdb0a91cf317ac64f8db62087f7cac9e3224c6e35afa1709b8bc70c6aea83708",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2be8b",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0x74b903b7fa2b5710b178d936dadf96de5753fd7c0e72f0eb9337dc6e8757525a",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2be96",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0x574385c7369143b8e7bcf7b12d978069ae1c2d68a4bfd88851af4c241fa042f5",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2be9e",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0x7b0130a3e8091f29cd253d5497d98dab853695d0f2c5603ad2752ac57db593d1",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2bea7",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0xa1c9ed9ca10a061b173c7552220d82889f6c782641498e6705dd111cced2d2d7",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2beae",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0xcb567eae9715e1b6da5b905eba2696f8df9274b80c996ab5a04c14c9821ec38a",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2c057",
    //     "io_index": "0x0",
    //     "io_type": "input",
    //     "tx_hash": "0x42954c09bdf78338e480376ab2b08feeb56a10abd78fbe568beeae10a219361d",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2c057",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0x42954c09bdf78338e480376ab2b08feeb56a10abd78fbe568beeae10a219361d",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2c057",
    //     "io_index": "0x1",
    //     "io_type": "input",
    //     "tx_hash": "0x42954c09bdf78338e480376ab2b08feeb56a10abd78fbe568beeae10a219361d",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2c057",
    //     "io_index": "0x1",
    //     "io_type": "output",
    //     "tx_hash": "0x42954c09bdf78338e480376ab2b08feeb56a10abd78fbe568beeae10a219361d",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2c057",
    //     "io_index": "0x2",
    //     "io_type": "input",
    //     "tx_hash": "0x42954c09bdf78338e480376ab2b08feeb56a10abd78fbe568beeae10a219361d",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2c057",
    //     "io_index": "0x3",
    //     "io_type": "input",
    //     "tx_hash": "0x42954c09bdf78338e480376ab2b08feeb56a10abd78fbe568beeae10a219361d",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2c057",
    //     "io_index": "0x4",
    //     "io_type": "input",
    //     "tx_hash": "0x42954c09bdf78338e480376ab2b08feeb56a10abd78fbe568beeae10a219361d",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2c057",
    //     "io_index": "0x5",
    //     "io_type": "input",
    //     "tx_hash": "0x42954c09bdf78338e480376ab2b08feeb56a10abd78fbe568beeae10a219361d",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2c057",
    //     "io_index": "0x6",
    //     "io_type": "input",
    //     "tx_hash": "0x42954c09bdf78338e480376ab2b08feeb56a10abd78fbe568beeae10a219361d",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2c057",
    //     "io_index": "0x7",
    //     "io_type": "input",
    //     "tx_hash": "0x42954c09bdf78338e480376ab2b08feeb56a10abd78fbe568beeae10a219361d",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2c17e",
    //     "io_index": "0x0",
    //     "io_type": "input",
    //     "tx_hash": "0x7c3ec7bd7a1df93c1109d6940096d218a513627ec5d5a2c71fae5da5a1149273",
    //     "tx_index": "0x1"
    // },
    // {
    //     "block_number": "0x2c17e",
    //     "io_index": "0x0",
    //     "io_type": "output",
    //     "tx_hash": "0x7c3ec7bd7a1df93c1109d6940096d218a513627ec5d5a2c71fae5da5a1149273",
    //     "tx_index": "0x1"
    // }
]

// export const txCluster = (txObjList: any): any => {  
export const txListObjCluster = (txObjList: any): any => {   //  数据分组
    const clusterItem: object = {};
    const cluster: [] = [];
    txObjList.forEach(element => {
        if (!clusterItem[element.tx_hash]) {
            cluster.push({
                tx_hash: element.tx_hash,
                dataItem: [element]
            } as never);
            clusterItem[element.tx_hash] = element;
        } else {
            cluster.forEach(ele => {
                if ((ele as any).tx_hash === element.tx_hash) {
                    (ele as any).dataItem.push(element);
                }
            });
        }
    });
    return cluster;
};

// --- txListResult --- [
//     {
//       tx_hash: '0xbc6f08a52e02ff06b825d0bf85fd150c194b2fb2fb149c13ca6eab909b999ffc',
//       dataItem: [ [Object] ]
//     },
//     {
//       tx_hash: '0x1cb41bd161ae75f94e9019afa0e7f98297f5404272dfe8de268f977cbbebc1a2',
//       dataItem: [ [Object], [Object] ]
//     }
//   ]

// "--- transaction --- {
//     transaction: {
//       cellDeps: [ [Object] ],
//       inputs: [ [Object] ],
//       outputs: [ [Object], [Object] ],
//       outputsData: [ '0x', '0x' ],
//       headerDeps: [],
//       hash: '0xbc6f08a52e02ff06b825d0bf85fd150c194b2fb2fb149c13ca6eab909b999ffc',
//       version: '0x0',
//       witnesses: [
//         '0x550000001000000055000000550000004100000037c3258dabb36a8bea38f3d07e76a51a160750dd5daf047f1192135eaada6fb476bc3da91e2c97cf7b637cca3dc6ec544ecdc08734fe685f4a213058ad68945e00'
//       ]
//     },
//     txStatus: {
//       blockHash: '0x3ae37307a653cafd0f501742e1adf523289550441deaf8ba686e22e4a8a75dff',
//       status: 'committed'
//     }
//   }"

// {
//     "block_number":"0x20b75",
//     "io_index":"0x0",
//     "io_type":"output",
//     "tx_hash":"0xbc6f08a52e02ff06b825d0bf85fd150c194b2fb2fb149c13ca6eab909b999ffc",
//     "tx_index":"0x1"
// },
function isContained(io_type, dataItem_List) {
    function findIn(dataItem) {
        return dataItem.io_type === io_type;
    }
    const dataItem = dataItem_List.find(findIn);
    return dataItem;
}
const hrpSize = 6
const extractPayloadFromAddress = (address: string) => {
    const addressPayload = ckbUtils.parseAddress(address, 'hex')
    return `0x${addressPayload.slice(hrpSize)}`
}

const getReceivedCapacity = (args, outputs) => {
    let capacity = BigInt(0);
    for(let index = 0; index <outputs.length; index ++ ){
        if(outputs[index].lock.args == args){
            capacity = capacity + BigInt(outputs[index].capacity);
        }
    }
    return capacity;
}

const getSendCapacity = (args, outputs) => {
    let capacity = BigInt(0);
    for(let index = 0; index <outputs.length; index ++ ){
        if(outputs[index].lock.args != args){
            capacity = capacity + BigInt(outputs[index].capacity);
        }
    }
    return capacity;
}

// --- inputs --- [{"previousOutput":{"txHash":"0x1d87a7aa39ebe2dcaf8d6151cb78663bb994a003b604f1f0b5b83199a143f31b","index":"0x1"},"since":"0x0"}]"
// "--- outputs --- [{"lock":{"codeHash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8","hashType":"type","args":"0x9b84887ab2ea170998cff9895675dcd29cd26d4d"},"type":null,"capacity":"0x746a528800"},{"lock":{"codeHash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8","hashType":"type","args":"0x3f1573b44218d4c12a91919a58a863be415a2bc3"},"type":null,"capacity":"0xb884d09831fdcbb"}]"
// "--- args --- 0x9b84887ab2ea170998cff9895675dcd29cd26d4d"
const address = 'ckt1qyqfhpyg02ew59cfnr8lnz2kwhwd98xjd4xsscxlae';
describe('get_transaction test', () => {
    it('01- getCapacityByLockHash', async () => {
        const newTxs = [];

        const txListResult = txListObjCluster(txListObjects);
        for (let index = 0; index < txListResult.length; index++) {
            const newTx = {};

            let isContainedInput = null;
            let isContainedOutput = null;

            const txObj = txListResult[index];
            console.log('--- txObj ---',txObj);

            newTx['address'] = address;
            newTx['hash'] = txObj.tx_hash;
            const dataItem0 = txObj.dataItem[0];
            if (dataItem0.block_number) {
                newTx['blockNum'] = parseInt(dataItem0.block_number, 16)
                const header = await ckb.rpc.getHeaderByNumber(dataItem0.block_number)
                if (!header) continue;
                newTx['timestamp'] = parseInt(header.timestamp, 16)
            }            
            const {transaction } = await ckb.rpc.getTransaction(txObj.tx_hash);
            const { inputs , outputs } = transaction;
            const args = extractPayloadFromAddress(address);

            isContainedInput = isContained('input', txObj.dataItem);
            isContainedOutput = isContained('output', txObj.dataItem);
            if (isContainedInput == null  && isContainedOutput != null) {
                const receiveCap = getReceivedCapacity(args,outputs);
                console.log('--- receiveCap ---',receiveCap);
                newTx['capacity'] = receiveCap;
                newTx['tag'] = "Received";
            } if (isContainedInput != null && isContainedOutput != null) {
                const sendCapacity = getSendCapacity(args,outputs);
                console.log('-- sendCapacity ---',sendCapacity);
                newTx['capacity'] = sendCapacity
                newTx['tag'] = "Send";
            }
            newTxs.push(newTx);
        }
        console.log('--- newTxs ---',newTxs);
    });
});




// let txList;
// export const parseBlockTxs(txs){
//     const opts: ckbUtils.AddressOptions = {
//         prefix: ckbUtils.AddressPrefix.Testnet,
//         type: ckbUtils.AddressType.HashIdx,
//         codeHashOrCodeHashIndex: '0x00',
//     }

//     const newTxs = []
//     for (const tx of txs) {
//         const newTx = {}

//         newTx['hash'] = tx.tx_hash
//         if (tx.block_number) {
//             newTx['blockNum'] = parseInt(tx.block_number, 16)
//             const header = await this.ckb.rpc.getHeaderByNumber(tx.block_number)
//             console.log('===> header: ', header, tx)
//             if (!header) continue;
//             newTx['timestamp'] = parseInt(header.timestamp, 16)
//         }

//         const txObj = (await this.ckb.rpc.getTransaction(tx.hash || tx.tx_hash)).transaction
//         console.log(txObj);

//         const outputs = txObj.outputs
//         const inputs = txObj.inputs

//         console.log("outputs num: ", outputs.length);
//         console.log("inputs num: ", inputs.length);

//         const newInputs = []

//         for (const input of inputs) {
//             const newInput = {}
//             const befTxHash = input.previousOutput.txHash

//             // cellbase
//             if (befTxHash !== EMPTY_TX_HASH) {

//                 // 0x000......00000 是出块奖励，inputs为空，cellbase
//                 const befIndex = input.previousOutput.index

//                 // const inputTxObj = await this.cellService.getTxByTxHash(befTxHash)
//                 const inputTxObj = (await this.ckb.rpc.getTransaction(befTxHash)).transaction
//                 const _output = inputTxObj.outputs[parseInt(befIndex, 16)]

//                 newInput['capacity'] = parseInt(_output.capacity, 16)
//                 newInput['address'] = ckbUtils.bech32Address(_output.lock.args, opts)

//                 newInputs.push(newInput)
//             }
//         }

//         newTx['inputs'] = newInputs

//         const newOutputs = []

//         for (const output of outputs) {
//             const newOutput = {}
//             newOutput['capacity'] = parseInt(output.capacity, 16)
//             newOutput['address'] = ckbUtils.bech32Address(output.lock.args, opts)
//             newOutputs.push(newOutput)
//         }

//         newTx['outputs'] = newOutputs
//         newTxs.push(newTx)
//     }

//     return newTxs
// }