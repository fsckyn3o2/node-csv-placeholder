  -- BBS Scripts
  -- ${cts.now}

  -- Line - ${vars.rowIndex}
  ${plh.INSERT_BS001}
  ${plh.INSERT_BS002}
  ${plh.INSERT_BS003}
  ${plh.INSERT_BS004}
  ${plh.SELECT_BS_HEADER1}
  ${plh.SELECT_BS_USERNAME}

  -- with 'notempty' condition : value of 'notempty' is '${notempty}'
  ${helper.notEmpty("${notempty}", plh.INSERT_BS001)}
  ${helper.notEmpty("${notempty}", plh.INSERT_BS002)}

  -- trim : ${vars.valueAfterTrim}
  -- switch test : ${vars.valueAfterSwitch}
