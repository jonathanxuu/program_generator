"use strict";
import { program } from "../program";
import { prepare_auth_path } from "../auto_generator";
var merkle_tools_1 = require("@settlemint/merkle-tools");
const rlp = require("rlp");
import { u64a_rescue } from "rescue";

let world_cup_constraint = {
  fields: [2], // the index of 2 is the support team
  operation: ["membership_in"],
  value: ["Brazil", "Spain", "England", "France"],
};
let result = auto_program_generater(world_cup_constraint);

console.log(result);
// the ctype of the world cup program is fixed, so the only parameter is the constraints.
export function auto_program_generater(constraints: any) {
  let whole_program = program;
  let constraint_program = handle_world_cup_constraint(constraints.value);
  whole_program = `${whole_program} ${constraint_program}`;
  whole_program = `
${whole_program}  
    pushw.mem.100 push.mem.101
    exec.sys::finalize_stack
end`;

  return whole_program;
}

function handle_world_cup_constraint(top_four_teams: any) {
  let auth_program = prepare_auth_path(3, 2); //[ 'left', 'right', 'right' ]
  let constraint_program = prepare_membership_in_operation(top_four_teams);

  let combine_program = `${auth_program} ${constraint_program}`;
  return combine_program;
}

function prepare_membership_in_operation(team_list: any) {
  let team_rlp_hashes = compute_team_hash(team_list);
  let compute_support_team_hash = `
        exec.pad_and_compute_rphash
    `;
  let push_all_rlp_hashes = ``;
  for (let i = 0; i < 4; i++) {
    let each_push = `push.${team_rlp_hashes[i][0]} push.${team_rlp_hashes[i][1]} push.${team_rlp_hashes[i][2]} push.${team_rlp_hashes[i][3]} eqw movdn.8 dropw `;
    push_all_rlp_hashes = `${push_all_rlp_hashes} ${each_push}`;
  }
  return `${compute_support_team_hash} ${push_all_rlp_hashes} dropw or or or pop.mem.101`;
}

function compute_team_hash(team_list: any) {
  let team_rlp_hashes: Array<BigUint64Array> = [];
  for (let i = 0; i < 4; i++) {
    let team_rlp = rlp.encode(team_list[i]);
    let team_u64a = new BigUint64Array(team_rlp.length);
    team_rlp.forEach((val: any, idx: any) => {
      team_u64a[idx] = BigInt(val);
    });
    let team_rphash = u64a_rescue(team_u64a);
    team_rlp_hashes[i] = team_rphash;
  }
  return team_rlp_hashes;
}
