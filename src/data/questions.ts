export type QuestionType = 'single' | 'multiple';

export interface QuizOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface QuizQuestion {
  id: number;
  topic: string;
  type: QuestionType;
  prompt: string;
  options: QuizOption[];
  correctIds: Array<'A' | 'B' | 'C' | 'D'>;
  explanation: string;
}

export const QUIZ_DURATION_SECONDS = 15 * 60; // 15:00
export const WARNING_THRESHOLD_SECONDS = 60; // Cảnh báo khi còn 1 phút
export const TOTAL_SCORE_SCALE = 10;

export const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    topic: 'Mệnh đề & Mệnh đề chứa biến',
    type: 'single',
    prompt: String.raw`Trong các phát biểu sau đây, phát biểu nào là một mệnh đề chứa biến?`,
    options: [
      {
        id: 'A',
        text: String.raw`"$2025$ là một số nguyên tố."`,
      },
      {
        id: 'B',
        text: String.raw`"Tổng ba góc trong một tam giác bằng $180^\circ$."`,
      },
      {
        id: 'C',
        text: String.raw`"$x^2 - 4 = 0$ với $x \in \mathbb{R}$."`,
      },
      {
        id: 'D',
        text: String.raw`"Hôm nay thời tiết thật dễ chịu!"`,
      },
    ],
    correctIds: ['C'],
    explanation: String.raw`Mệnh đề chứa biến là khẳng định có chứa biến và tính đúng hay sai của nó phụ thuộc vào giá trị cụ thể của biến. Phát biểu "$x^2 - 4 = 0$ với $x \in \mathbb{R}$" đúng khi $x = \pm 2$ và sai với các giá trị $x$ khác. Các câu A, B là mệnh đề toán học xác định, còn câu D là câu cảm thán nên không phải mệnh đề.`,
  },
  {
    id: 2,
    topic: 'Mệnh đề phủ định',
    type: 'single',
    prompt: String.raw`Cho mệnh đề $P$: "$\forall x \in \mathbb{R},\; x^2 + 1 > 0$". Mệnh đề phủ định $\overline{P}$ của mệnh đề $P$ là:`,
    options: [
      {
        id: 'A',
        text: String.raw`$\overline{P}$: "$\forall x \in \mathbb{R},\; x^2 + 1 \le 0$"`,
      },
      {
        id: 'B',
        text: String.raw`$\overline{P}$: "$\exists x \in \mathbb{R},\; x^2 + 1 \le 0$"`,
      },
      {
        id: 'C',
        text: String.raw`$\overline{P}$: "$\exists x \in \mathbb{R},\; x^2 + 1 < 0$"`,
      },
      {
        id: 'D',
        text: String.raw`$\overline{P}$: "$\forall x \in \mathbb{R},\; x^2 + 1 < 0$"`,
      },
    ],
    correctIds: ['B'],
    explanation: String.raw`Khi phủ định mệnh đề có chứa ký hiệu phổ biến ($\forall$), ta đổi $\forall$ thành ký hiệu tồn tại ($\exists$) và phủ định điều kiện đi kèm: phủ định của "$> 0$" là "$\le 0$". Do đó $\overline{P}$ là "$\exists x \in \mathbb{R},\; x^2 + 1 \le 0$".`,
  },
  {
    id: 3,
    topic: 'Mệnh đề kéo theo',
    type: 'multiple',
    prompt: String.raw`Với $n \in \mathbb{Z}$, xét hai mệnh đề $P$: "$n$ chia hết cho $6$" và $Q$: "$n$ chia hết cho $3$". Những khẳng định nào sau đây là đúng?`,
    options: [
      {
        id: 'A',
        text: String.raw`Mệnh đề kéo theo $P \Rightarrow Q$ ("Nếu $n$ chia hết cho $6$ thì $n$ chia hết cho $3$") là mệnh đề đúng.`,
      },
      {
        id: 'B',
        text: String.raw`Mệnh đề đảo $Q \Rightarrow P$ ("Nếu $n$ chia hết cho $3$ thì $n$ chia hết cho $6$") là mệnh đề đúng.`,
      },
      {
        id: 'C',
        text: String.raw`Trong mệnh đề $P \Rightarrow Q$, $P$ là điều kiện đủ để có $Q$.`,
      },
      {
        id: 'D',
        text: String.raw`Nếu $P$ sai và $Q$ đúng thì mệnh đề kéo theo $P \Rightarrow Q$ là mệnh đề sai.`,
      },
    ],
    correctIds: ['A', 'C'],
    explanation: String.raw`Khẳng định A đúng vì mọi số nguyên $n = 6k = 3(2k)$ đều chia hết cho $3$. Khẳng định B sai (phản ví dụ: $n = 3$ chia hết cho $3$ nhưng không chia hết cho $6$). Khẳng định C đúng theo định nghĩa điều kiện đủ. Khẳng định D sai vì $P \Rightarrow Q$ chỉ sai khi $P$ đúng và $Q$ sai.`,
  },
  {
    id: 4,
    topic: 'Mệnh đề tương đương',
    type: 'single',
    prompt: String.raw`Xét các cặp mệnh đề $P$ và $Q$ dưới đây. Trường hợp nào tạo thành mệnh đề tương đương $P \Leftrightarrow Q$ đúng?`,
    options: [
      {
        id: 'A',
        text: String.raw`$P$: "$a = b$" và $Q$: "$a^2 = b^2$" (với $a, b \in \mathbb{R}$).`,
      },
      {
        id: 'B',
        text: String.raw`$P$: "Tứ giác $ABCD$ là hình vuông" và $Q$: "Tứ giác $ABCD$ có bốn cạnh bằng nhau".`,
      },
      {
        id: 'C',
        text: String.raw`$P$: "Tam giác $ABC$ cân tại $A$" và $Q$: "Tam giác $ABC$ có $\widehat{B} = \widehat{C}$".`,
      },
      {
        id: 'D',
        text: String.raw`$P$: "$a > 0$ và $b > 0$" và $Q$: "$a \cdot b > 0$" (với $a, b \in \mathbb{R}$).`,
      },
    ],
    correctIds: ['C'],
    explanation: String.raw`Mệnh đề $P \Leftrightarrow Q$ đúng khi cả $P \Rightarrow Q$ và $Q \Rightarrow P$ đều đúng. Tam giác $ABC$ cân tại $A$ khi và chỉ khi $\widehat{B} = \widehat{C}$, nên C đúng. Các phương án A, B, D đều có chiều đảo $Q \Rightarrow P$ sai (ví dụ: $a = -2, b = 2$; hình thoi; hoặc $a = -1, b = -2$).`,
  },
  {
    id: 5,
    topic: 'Ký hiệu phổ biến (∀) và tồn tại (∃)',
    type: 'multiple',
    prompt: String.raw`Trong các mệnh đề chứa ký hiệu lượng từ sau đây, những mệnh đề nào là mệnh đề đúng?`,
    options: [
      {
        id: 'A',
        text: String.raw`$\forall x \in \mathbb{R},\; x^2 - 2x + 2 > 0$`,
      },
      {
        id: 'B',
        text: String.raw`$\exists x \in \mathbb{Q},\; x^2 = 2$`,
      },
      {
        id: 'C',
        text: String.raw`$\forall x \in \mathbb{R},\; x^2 > x$`,
      },
      {
        id: 'D',
        text: String.raw`$\exists n \in \mathbb{N},\; n^2 = n$`,
      },
    ],
    correctIds: ['A', 'D'],
    explanation: String.raw`Mệnh đề A đúng vì $x^2 - 2x + 2 = (x - 1)^2 + 1 \ge 1 > 0,\;\forall x \in \mathbb{R}$. Mệnh đề D đúng vì tồn tại $n = 0$ (hoặc $n = 1$) thuộc $\mathbb{N}$ thỏa mãn $n^2 = n$. Mệnh đề B sai vì $\pm\sqrt{2} \notin \mathbb{Q}$. Mệnh đề C sai vì với $x = \frac{1}{2}$, ta có $\left(\frac{1}{2}\right)^2 = \frac{1}{4} < \frac{1}{2}$.`,
  },
];
