# program_generator

For each constraint, you need to set `demo_constraints`, here is an example:


```js
auto_program_generater(4, demo_constraints);
```

The first parameter - `4`, means that the VC contains 4 fields total.


```js
let demo_constraints = [
    {
        fields: [1],
        operation: ["gt"],
        value: 18,
    },
];
```

In this constraint, we use the program_generator to generate a ZKP_Program which judge whether the first field if greater than 18.

The program_generator can do the following things:

- For single element constraint:
  - [x] For number: greater than / greater than or equal / less than / not equal / less than or equal / less than
  - [ ] For String: contain / uncontain / start with / end with (here, already accomplish the first edition, which needs to test)  
- For multi elements constraint:
  - [x] For numbers: sum/average (gt/gte/neq/lte/lt)
  - [x] For numbers: compare two elements (gt/gte/eq/lte/lt/neq)