"use strict";
import { program } from "./program";
var merkle_tools_1 = require("@settlemint/merkle-tools");

// some usage of mem: mem[100] used to store roothash
// mem[101] use to store the constraints assertion results, should perform 'and' every time;
// todo1: should set mem[101] to 1 at the beginning of the whole program, `mem_load.101 and  mem_store.101` then.
// todo2: the roothash should be pushw.mem.100 at the beginning of the whole program as well, used to make sure
//       each auth-path leads to an 'identical' roothash.
// todo3: each roothash which is generated via auth-path should compare with the 'initial roothash' which is stored into at the beginning

// as to each leaf ：
// exec.read_new_leaf exec.read_and_copy exec.multi_rphash loadw.adv(import uuid) rphash （generate saltedhash）

// before handling each leaf should `mem_load.99` first
// mem_load.99 exec.number_add （push.23 gt）mem_load.101 and mem_store.101


let demo_constraints = [
  // {
  //   fields: [1],   // 第一个字段 ： birth 的时间戳
  //   operation: ["lt"],    // 判断 birth 对应的时间 早于 2005 年 1 月 1 日
  //   value: 1104508800, // 2005 年 1 月 1 日 的时间戳 
  // },
  {
    fields: [2],   // 第一个字段 ： nation code
    operation: ["membership_out"],    // 判断 nation code 是否是欧盟之一
    value: [40, 56, 100, 196, 203, 276, 208, 724, 233, 246, 250, 300, 191, 348, 372, 380, 440, 442, 428, 470, 528, 616, 642, 703, 705, 752], // 欧盟成员国的国家代码
  }
];


console.log(auto_program_generater(4, demo_constraints))
function auto_program_generater(leaves_number: any, constraints: any) {
  let whole_program = program;
  for (const key in constraints) {
    if (Object.hasOwnProperty.call(constraints, key)) {
      const element = constraints[key];
      let constraint_program;

      constraint_program = handle_single_constraint(
        leaves_number,
        element.fields[0],
        element.operation[0],
        element.value
      );

      whole_program = `${whole_program} ${constraint_program}`;
    }
  }
  whole_program = `
${whole_program}  
    mem_load.101 padw mem_loadw.100
end`;
  return whole_program;
}

// handle single constraint, prepare auth-proc and cons-proc.
function handle_single_constraint(leaves_number: any, fields: any, operation: any, value: any) {
  let auth_program = prepare_auth_path(leaves_number, fields); //[ 'left', 'right', 'right' ]
  let constraint_program;
  let combine_program;
  switch (typeof value) {
    case "string":
      constraint_program = prepare_string_operation(operation, value);
      break;
    case "number":
      constraint_program = prepare_number_operation_single(operation, value);
      break;
    case "object":
      {
        if (operation == "membership_in") {
          constraint_program = prepare_membership_in_operation(value);
        } else if (operation == "membership_out") {
          constraint_program = preprare_membership_out_operation(value);
        } else {
          throw new Error("The operation for object value is wrong!");
        }
      }
      break;
    default:
      throw new Error("wait to add more data type.....");
  }
  combine_program = `${auth_program} ${constraint_program}`;
  return combine_program;
}

function prepare_membership_in_operation(
  value: any
) {

  let constraint_program = "";
  let push_program = "";
  let read_number = "mem_load.99 exec.number_add "
  for (let i = 0; i < value.length; i++) {
    push_program = `${push_program}push.${value[i]} swap `;
  }
  let check_in_program = `
  push.0 
  repeat.${value.length}
      dup.1 movup.3 eq
      if.true
          drop push.1 
      end
  end
  if.true
      mem_load.101 push.1 and mem_store.101
  else
      push.0 mem_store.101
  end
  drop
  `
  constraint_program = `${read_number} ${push_program} ${check_in_program}`
  return constraint_program
}

function preprare_membership_out_operation(
  value: any
) {
  let constraint_program = "";
  let push_program = "";
  let read_number = "mem_load.99 exec.number_add "
  for (let i = 0; i < value.length; i++) {
    push_program = `${push_program}push.${value[i]} swap `;
  }
  let check_out_program = `
  push.0 
  repeat.${value.length}
      dup.1 movup.3 eq
      if.true
          drop push.1 
      end
  end
  if.true
      push.0 mem_store.101
  else
      push.1 mem_load.101 and mem_store.101
  end
  drop
  `
  constraint_program = `${read_number} ${push_program} ${check_out_program}`
  return constraint_program

}


// // used to compare auth-proc for each leaf, push that into mem[301-303]
// function prepare_auth_path_and_read_to_mem(leaves_number: any, field: any, number_to_save: any) {
//   let auth_program = prepare_auth_path(leaves_number, field);
//   return `${auth_program} 
//     mem_load.99 exec.number_add mem_store.${301 + number_to_save}`;
// }

// This function is used to prepare the authentication path for certain leaf, and prepare different code for different leaf
// due to the location (right/left) of a leaf when getting into a new layer.
function prepare_auth_path(leaves_number: any, leaf_index: any) {
  var treeOptions = {
    hashType: "md5",
  };
  var merkleTools = new merkle_tools_1["default"](treeOptions); // treeOptions is optional, we don't care much of the value here
  for (var i = 0; i < leaves_number; i++) {
    // this just a helper function, the hash here doesn't mean anything
    merkleTools.addLeaf("05ae04314577b2783b4be98211d1b72476c59e9c413cfb2afa2f0c68e0d93911", false);
  }
  merkleTools.makeTree(false);
  var to_deal_with = merkleTools.getProof(leaf_index);
  var need_aux_position = [];
  for (var i = 0; i < to_deal_with.length; i++) {
    need_aux_position.push(Object.getOwnPropertyNames(to_deal_with[i]).pop());
  }
  var program_text = "";
  for (const key in need_aux_position) {
    if (Object.hasOwnProperty.call(need_aux_position, key)) {
      const element = need_aux_position[key];
      if (element == "left") {
        program_text = program_text + "adv_push.4" + " swapw hmerge ";
      } else {
        program_text = program_text + "adv_push.4" + " hmerge ";
      }
    }
  }
  // mem[100] is used to store roothash, compare to the pre-roothash; If not the same, the roothash is wrong
  program_text = `
    exec.read_new_leaf exec.read_and_copy exec.multi_rphash dupw mem_storew.40 dropw adv_push.4 hmerge 
    ${program_text}
    padw mem_loadw.100 dupw mem_storew.100 dropw movup.4 eq swap movup.4 eq movup.2 movup.4 
    eq movup.3 movup.4 eq and and and not 
    if.true 
        padw mem_storew.100 dropw
    end `;
  return program_text;
}

// use to handle `Single String Constraint` 
// todo
function prepare_string_operation(operation: any, value: any) {
  var program_text;

  let start_compare_text = `push.${value.charCodeAt(value.length)} eq`;
  for (let i = value.length - 1; i >= 0; i--) {
    start_compare_text = `${start_compare_text} mem_load.101 and mem_store.101 push.${value.charCodeAt(i)} eq
        `
  }
  start_compare_text = `${start_compare_text} mem_load.101 and mem_store.101`

  let end_compare_text = ` push.${value.charCodeAt(value.length)} eq`;
  for (let i = value.length - 1; i >= 0; i--) {
    end_compare_text = `${end_compare_text} mem_load.101 and mem_store.101 push.${value.charCodeAt(i)} eq
        `
  }
  end_compare_text = `${end_compare_text} mem_load.101 and mem_store.101`


  let dup_program = "";
  let read_to_memory = ``;
  let j = 0;
  for (let i = value.length - 1; i >= 0; i--, j++) {
    read_to_memory = `${read_to_memory}  push.${value.charCodeAt(i)} push.${j + 301} mem_store 
    `
    dup_program = `${dup_program} dup.${value.length}`
      ;
  }

  let drop_text = "";
  for (let i = 0; i < value.length + 1; i++) {
    drop_text = `${drop_text} drop`
  }
  switch (operation) {
    case "contain":
      // 1. read advice_tape to memory, which start at 301
      // 2. the max compare time should be `mem[99] - (value).length - 1)` should stored on the second stack.
      // 3. the next address to be compared should stored on stack automatically.
      // 4. mem[300] use to store the compare result(init with 0), once found a success match, mem[300] should be 1. else 0
      // 5. mem[value.length + 301] use to store single compare result,every `while` should make it `1` 
      program_text = `
    mem_load.99 dup.0 push.${value.length} gte 
    if.true
        push.0 mem_store.300
        sub.${value.length - 4}${read_to_memory}    dup.0 push.1 gte
        while.true
            push.1 mem_store.${301 + value.length} ${dup_program}
            push.301 
            repeat.${value.length}
                dup.0 mem_load dup.0 dup.2 mem_store
                movup.2 eq mem_load.${301 + value.length} and mem_store.${301 + value.length}
                add.1
            end
            drop sub.1 swap drop
            mem_load.${301 + value.length} push.1 eq
            if.true
                push.1 mem_store.300
            end
            dup.0 push.1 gte
        end
        mem_load.300 mem_load.101 and mem_store.101 ${drop_text}
    else
        dup.0 push.1 gte 
        while.true
            swap drop sub.1 dup.0 push.1 gte
        end
        drop push.0 mem_store.101
    end`
      break;
    case "uncontain":
      program_text = `
    mem_load.99 dup.0 push.${value.length + 2} gte
    if.true
        push.1 mem_store.300
        sub.${value.length - 1}${read_to_memory}    dup.0 push.1 gte
        while.true
            push.1 mem_store.${301 + value.length} ${dup_program}
            push.301 
            repeat.${value.length}
                dup.0 mem_load dup.0 dup.2 mem_store
                movup.2 eq mem_load.${301 + value.length} and mem_store.${301 + value.length}
                add.1
            end
            drop sub.1 swap drop
            mem_load.${301 + value.length} push.1 eq
            if.true
                push.0 mem_store.300
            end
            dup.0 push.1 gte
        end
        mem_load.300 mem_load.101 and mem_store.101 ${drop_text}
    else
        dup.0 push.1 gte 
        while.true
            swap drop sub.1 dup.0 push.1 gte
        end
        drop push.0 mem_store.101
    end
            `
      break;
    case "start with":
      // here, mem_load.99 needs to be longer than the value.length
      // the first element is at the deepest of the stack.
      program_text = `
    mem_load.99 dup.0 push.${value.length + 2} gte 
    if.true
        sub.${value.length + 1}
        dup.0 push.1 gte
        while.true
            swap drop sub.1 dup.0 push.1 gte
        end
        drop  ${start_compare_text} mem_load.101 and mem_store.101 drop
    else
        dup.0 push.1 gte 
        while.true
            swap drop sub.1 dup.0 push.1 gte
        end
        drop push.0 mem_store.101 drop
    end`;
      break;
    case "end with":
      // here, mem_load.99 needs to be longer than the value.length
      // the last element is on the top of the stack.

      program_text = `
    mem_load.99 dup.0 push.${value.length + 2} gte 
    if.true
        mem_store.99
        ${end_compare_text} 
        mem_load.99 sub.${value.length + 1}
        dup.0 push.1 gte
        while.true
            swap drop sub.1 dup.0 push.1 gte
        end
        drop drop
    else
        dup.0 push.1 gte 
        while.true
            swap drop sub.1 dup.0 push.1 gte
        end
        drop push.0 mem_store.101 drop
    end
            `
      break;
    default:
      console.error("the string operation is wrong!!!!!")
  }
  return program_text;
}

// use to handle `Single Number Constraint`
function prepare_number_operation_single(operation: any, value: any) {
  var program_text;
  let decimal = value.toString().split(".").length - 1;
  if (decimal > 1) throw new Error("decimal value has more than 1 digits!");
  let multi = decimal == 0 ? 1 : 10;
  switch (operation) {
    case "gt":
      program_text = "push." + value * multi + " gt";
      break;
    case "gte":
      program_text = "push." + value * multi + " gte";
      break;
    case "neq":
      program_text = "push." + value * multi + " neq";
      break;
    case "lte":
      program_text = "push." + value * multi + " lte";
      break;
    case "lt":
      program_text = "push." + value * multi + " lt";
      break;
    default:
      throw new Error("error number compare operation!");
  }
  program_text = `
  mem_load.99 exec.number_add mul.${multi} ${program_text} mem_load.101 and mem_store.101`;
  return program_text;
}
