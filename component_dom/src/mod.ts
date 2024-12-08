// take builder for template strings

// then make builder for DOM from template_str builder results

// the "stack" is basically an object:
interface StackBit {
	parent: Node;
	left: Node;
	dom: Node[];
	injections: number[];
}
