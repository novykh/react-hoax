import React, { useMemo, useCallback } from "react";
import identity from "lodash/identity";

const onValueChange = ({ target: { value: val } }) => val;
const onToggle = ({ target: { checked } }) => checked;

export default useMember => {
  const BaseField = ({
    Component = "input",
    fieldKey,
    select,
    resourceId,
    getUpdate,
    onChange = identity,
    ...rest
  }) => {
    const [value, setValue, error] = useMember({
      fieldKey,
      select,
      resourceId
    });

    const update = (...args) => setValue(onChange(...args));

    return useMemo(
      () => (
        <Component
          name={fieldKey}
          data-testid={fieldKey}
          onChange={update}
          value={value}
          error={error}
          name={fieldKey}
          {...rest}
        />
      ),
      [value, error, rest.options]
    );
  };

  const Select = ({
    Component = "select",
    onChange = onValueChange,
    options = [],
    ...rest
  }) => (
    <BaseField
      Component={Component}
      onChange={onChange}
      options={options}
      {...rest}
    />
  );

  const Input = ({ onChange = onValueChange, ...rest }) => (
    <BaseField type="text" onChange={onChange} {...rest} />
  );

  const Checkbox = ({ type = "checkbox", onChange = onToggle, ...rest }) => (
    <BaseField type={type} onChange={onChange} {...rest} />
  );

  return {
    Select,
    Checkbox,
    Input
  };
};
