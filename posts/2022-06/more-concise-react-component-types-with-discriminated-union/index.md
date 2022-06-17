---
title: Typescript - discriminated unions for more concise react component prop types
description: If your react component can accept a prop (or not) based on the value of another prop, typescript can help to avoid mistakes by giving proper warnings on incorrect usage.
tags: ["posts", "daily", "today I learned", "react", "typescript"]
date: 2022-06-17
layout: layout.html
---

I had a problem where a component providing our app graphql capabilities was returning one of those:
- `<ApolloProvider />` - real graphql provider to allow testing some legacy code
- `<MockedProvider />` - mocked graphql provider for testing with... mocks

```tsx
const NetworkProvider = ({client, isMocked, mocks}) => {
    if (isMocked) return <MockedProvider mocks={mocks} />
    
    return <ApolloProvider client={client} />
}
```

Note the different returned providers accept different props. `MockedProvider` accepts `mocks` prop, while the `ApolloProvider` does not, instead it accepts an optional `client` prop. That's an excellen opportunity to mix up the props and pass something that makes no sense. In the old days I used to use a check in the component to warn user incorrect props were passed, something like this:

```ts
if (!props.isMocked && !!props.mocks) {
    throw new Error('Please only pass mocks if isMocked is true. ')
}
if (props.isMocked && !!props.client) {
    throw new Error('Please only pass client if isMocked is false. ')
}
```

Today, typescript can warn us if we pass incorrect props based on another prop, removing any need to do such checks. We just need to create 2 interfaces, one for each group of props, both having at least 1 common prop to help TS identify which of the 2 interfaces should be applied.

```tsx
import {MockedRequest} from "msw";

interface MockedProviderProps {
    isMocked: true // the common prop
    mocks: MockedRequest[]
}

interface ApolloProviderProps {
    isMocked: false // the common prop
    client: ApolloClient<unknown>
}

type Props = MockedProviderProps

const NetworkProvider = ({client, isMocked, mocks}: Props) => {
    if (isMocked) return <MockedProvider mocks={mocks} />

    return <ApolloProvider client={client} />
}
```

Now if we try to do something stupid - like pass the `mocks` prop while `isMocked === false`, typescript will warn us.

Just to give another, even more contrived example, let's use an imaginary component `Person`. The Persons live in a really horrible world where you can only choose 2 jobs, and if you don't have a hobby as an adult, everybody thinks you love nothing. It bodes well to our test case though.

```tsx
interface AdultProps {
  // Usually examples use "type: 'adult' | 'child'" as common property.
  // Let's use a boolean just for fun, to make it clear it can work.
  type: 'adult'; // "isAdult" is a common property between an adult and a Child
  employer: string; // An adult must have an employeer
  jobTitle: "king" | "engineer"; // and work in one of our rather limited fields.
  hobby?: "computers" | "fishing"; // An adult can have hobby, but it's not required.
}

interface ChildProps {
  type: 'child'; // The common property allows Typescript to discriminate the types.
  hobby: "computers" | "mudcakes"; // A child must have a hobby, note it can overlap with adult hobbies.
  school: string; // A child must have school.
  // It must not have employer or jobTitle (from the adult interface).
}

interface CommonProps {
  name: string; // Both a child and an adult have names.
}

// Props is a combo of Common props and either adult or child props.
type Props = CommonProps & (AdultProps | ChildProps);

const Person = (props: Props) => {
  if (props.type === 'adult') {
    // We can't just destructure the props when declaring the function.
    // Typescript won't be sure they'll be available yet.
    // It will be though after we check the common prop and determine type.  
    const { name, employer, jobTitle, hobby } = props;

    return (
      <>
        {`${name}, a(n) ${jobTitle} employed by ${employer}. Loves 
        ${hobby ?? "nothing"}.`}
      </>
    );
  }

  const { name, school, hobby } = props;
  return <>{`${name}, a kid studying at ${school}. Loves ${hobby}.`}</>;
};

export default function App() {
    // Now typescript will warn us if we mess up
  return (
    <>
      <Person
        name="Arthur"
        isAdult={true}
        employer="Townsfolk"
        jobTitle="king"
      />
      <br />
      <Person
        name="John"
        isAdult={false}
        hobby="fishing" // Typescript will warn us that only adults can fish. In it's own words...
        school="Vilnius 1st middle school"
      />
    </>
  );
}
```

Try it out in this codesandbox. Try adding `school="xyz"` prop to the `Person` with `isAdult={true}` prop. Note how typescript warns you that this Person can not have such a prop.

<iframe src="https://codesandbox.io/embed/typescript-discriminated-union-props-k1786b?fontsize=14&hidenavigation=1&theme=dark&view=editor"
style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
title="typescript-discriminated-union-props"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>


Further reading:

- [Discriminated unions - this is what I was talking about](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
- [Another example](https://www.developerway.com/posts/advanced-typescript-for-react-developers-discriminated-unions)

Have a great day, reader. End.  