// validate interface and function for user inputs
interface Validatable {
  value: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInputs: Validatable) {
  // if is required is on
  let isValid = true;
  // if string check if length is not equal to 0
  if (validatableInputs.required) {
    isValid = isValid && validatableInputs.value.trim().toString().length !== 0;
  }

  // check string minlength
  if (
    validatableInputs.minLength != null &&
    typeof validatableInputs.value === "string"
  ) {
    isValid =
      isValid && validatableInputs.value.length >= validatableInputs.minLength;
  }

  // check string maxlenfth
  if (
    validatableInputs.maxLength != null &&
    typeof validatableInputs.value === "string"
  ) {
    isValid =
      isValid && validatableInputs.value.length <= validatableInputs.maxLength;
  }

  // check min number
  if (
    validatableInputs.min != null &&
    typeof validatableInputs.value === "number"
  ) {
    isValid = isValid && +validatableInputs.value >= validatableInputs.min;
  }

  // check max number
  if (
    validatableInputs.max != null &&
    typeof validatableInputs.value === "number"
  ) {
    isValid = isValid && +validatableInputs.value <= validatableInputs.max;
  }

  //return result
  return isValid;
}

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  templateChildElment: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;
  constructor() {
    // get the UI template with ID: project-input
    this.templateElement = document.getElementById(
      "project-input"
    ) as HTMLTemplateElement;

    // get the host UI template with ID: app
    this.hostElement = document.getElementById("app") as HTMLDivElement;

    // get the deepCopy of the template content
    const importedTempleNode = document.importNode(
      this.templateElement.content,
      true
    );

    // from the deep copy get the first Child Element
    this.templateChildElment =
      importedTempleNode.firstElementChild as HTMLFormElement;
    console.log("child", this.templateChildElment);
    this.templateChildElment.id = "user-input";
    // AFTER GETTING THE FIRST CHLD ATTACH IT TO THE HOST ELEMENT
    this.attach();

    // get the input fields from the child element i.e. form
    this.titleInputElement = this.templateChildElment.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionElement = this.templateChildElment.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.templateChildElment.querySelector(
      "#people"
    ) as HTMLInputElement;

    // add the configure setting to instance/class
    this.configure();
  }

  // Attach the template form-input to the hostElement
  private attach() {
    this.hostElement.insertAdjacentElement(
      "afterbegin",
      this.templateChildElment
    );
  }

  // Configure the form submit event handler with bind
  private configure() {
    this.templateChildElment.addEventListener(
      "submit",
      this.submitHandler.bind(this)
    );
  }

  // form submithandler function
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInputs();
    if (Array.isArray(userInput)) {
      console.log(this.gatherUserInputs());
      this.clearInput();
    }
  }

  // gather the user inputs
  private gatherUserInputs(): [string, string, number] | void {
    const title = this.titleInputElement.value;
    const validateTitle: Validatable = {
      value: title,
      required: true,
    };
    const description = this.descriptionElement.value;
    const validateDescription: Validatable = {
      value: description,
      required: true,
      minLength: 5,
    };
    const people = this.peopleInputElement.value;
    const validatePeople: Validatable = {
      value: description,
      required: true,
      min: 1,
      max: 10,
    };
    //check if empty
    if (
      !validate(validateTitle) ||
      !validate(validateDescription) ||
      !validate(validatePeople)
    ) {
      alert("Invalid Input, please try again!");
      return;
    } else {
      return [title, description, +people];
    }
  }

  // function to clear the input once submit handler is done, correctly
  private clearInput(): void {
    this.titleInputElement.value = "";
    this.descriptionElement.value = "";
    this.peopleInputElement.value = "";
  }
}

const dragDrop = new ProjectInput();
